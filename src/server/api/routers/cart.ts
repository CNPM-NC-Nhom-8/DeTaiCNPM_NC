import { InsuranceTypeOptions } from "@/components/phone/data";

import { authProcedure, createTRPCRouter, publicProcedure } from "../trpc";

import type { Insurance } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import z from "zod";

export const cartRouter = createTRPCRouter({
	addItemIntoCart: authProcedure
		.input(z.object({ maSP: z.string(), insuranceOption: z.custom<Insurance>(), quanlity: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const [existCartItem, currentSP] = await ctx.db.$transaction([
				ctx.db.cartItem.findFirst({
					where: { MaSP: input.maSP, InsuranceType: input.insuranceOption },
				}),
				ctx.db.sanPhamBienThe.findFirst({
					where: { MaSP: input.maSP },
					include: { MatHang: true },
				}),
			]);

			if (!currentSP) throw new TRPCError({ code: "NOT_FOUND", message: "Sản phẩm không tồn tại" });

			if (!existCartItem) {
				if ((currentSP.MatHang?.TonKho ?? 0) - input.quanlity <= 0) {
					throw new TRPCError({ code: "BAD_REQUEST", message: "Sản phẩm không còn đủ hàng!" });
				}

				await ctx.db.cartItem.create({
					data: {
						Quantity: input.quanlity,
						InsuranceType: input.insuranceOption,
						MaKhachHang: ctx.user.userId,
						MaSP: input.maSP,
					},
				});
				return;
			}

			if ((currentSP.MatHang?.TonKho ?? 0) - (existCartItem.Quantity + input.quanlity) <= 0) {
				throw new TRPCError({ code: "BAD_REQUEST", message: "Sản phẩm không còn đủ hàng!" });
			}

			await ctx.db.cartItem.update({
				data: { Quantity: { increment: input.quanlity } },
				where: { MaCartItem: existCartItem.MaCartItem },
			});
		}),

	getCartAmount: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.user.userId) return 0;
		return ctx.db.cartItem.count({ where: { MaKhachHang: ctx.user.userId } });
	}),

	getCartItems: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.user.userId) return [];

		return ctx.db.cartItem.findMany({
			where: { MaKhachHang: ctx.user.userId },
			include: { SanPham: { include: { SanPhamMau: true, MatHang: true } } },
			orderBy: [
				{ addedAt: "desc" },
				{ SanPham: { SanPhamMau: { TenSP: "asc" } } },
				{ SanPham: { DungLuong: "asc" } },
				{ SanPham: { Mau: "asc" } },
			],
		});
	}),

	payment: publicProcedure
		.input(z.object({ maCartItems: z.string().array(), paymentMethod: z.enum(["Cash", "Bank", "None"]) }))
		.mutation(async ({ ctx, input }) => {
			if (!ctx.user.userId) return;
			if (input.paymentMethod === "None")
				throw new TRPCError({ code: "BAD_REQUEST", message: "Bạn chưa chọn phương thức thanh toán." });

			const currentUser = await ctx.db.taiKhoan.findFirst({
				where: { MaTaiKhoan: ctx.user.userId },
				include: { KhachHang: true },
			});

			if (!currentUser || !currentUser.KhachHang)
				throw new TRPCError({
					code: "PRECONDITION_FAILED",
					message: "Vui lòng liên hệ quản trị viên nếu bạn gặp lỗi này!",
				});

			const data = await ctx.db.cartItem.findMany({
				where: { MaCartItem: { in: input.maCartItems }, MaKhachHang: currentUser.MaTaiKhoan },
				include: { SanPham: { select: { Gia: true, MaSP: true, MatHang: true } } },
			});

			const isInStock = data.every((item) => item.SanPham.MatHang!.TonKho - item.Quantity >= 0);

			if (!isInStock)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"1 hoặc nhiều sản phẩm trong giỏ hàng của bạn đã hết hàng hoặc không còn đủ với số lượng bạn mua!",
				});

			// Xóa các item trong giỏ hàng
			await ctx.db.cartItem.deleteMany({
				where: { MaCartItem: { in: input.maCartItems }, MaKhachHang: currentUser.MaTaiKhoan },
			});

			// Tạo 1 đơn hàng mới
			const paymentDetail = await ctx.db.donHang.create({
				data: {
					DiaChi: currentUser.KhachHang.DiaChi ?? "Không có",
					Email: currentUser.Email,
					HoTen: (currentUser.Ho ?? "" + " " + currentUser.Ten ?? "").trim(),
					PhuongThucTT: input.paymentMethod,
					SDT: currentUser.SDT ?? "Không có",
					TongTien: data.reduce(
						(prev, curr) =>
							(prev +=
								curr.SanPham.Gia * curr.Quantity +
								(InsuranceTypeOptions.find(({ type }) => type === curr.InsuranceType)?.price ?? 0)),
						0,
					),
					TrangThai: "Hoàn thành thanh toán",
					maKhachHang: currentUser.MaTaiKhoan,
					CT_DonHang: {
						createMany: {
							data: data.map((item) => ({
								MaMH: item.SanPham.MatHang!.MaMH,
								MaSP: item.MaSP,
								SoLuong: item.Quantity,
								InsuranceType: item.InsuranceType,
							})),
							skipDuplicates: true,
						},
					},
				},
			});

			// Cập nhật số lượng bên mặt hàng
			for (const item of data) {
				await ctx.db.matHang.update({
					where: { MaMH: item.SanPham.MatHang?.MaMH },
					data: { TonKho: { decrement: item.Quantity } },
				});
			}

			return { data: paymentDetail };
		}),

	updateCartItem: authProcedure
		.input(
			z.object({
				MaCartItem: z.string(),
				data: z.discriminatedUnion("type", [
					z.object({ type: z.literal("update"), insuranceType: z.custom<Insurance>() }),
					z.object({ type: z.literal("delete") }),
					z.object({ type: z.literal("quanlity"), option: z.enum(["increase", "decrease"]) }),
				]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			switch (input.data.type) {
				case "update": {
					const currentItem = await ctx.db.cartItem.count({ where: { MaCartItem: input.MaCartItem } });

					if (!currentItem)
						throw new TRPCError({
							code: "UNPROCESSABLE_CONTENT",
							message: "Sản phảm không tồn tại trong giỏ hàng!",
						});

					await ctx.db.cartItem.update({
						where: { MaCartItem: input.MaCartItem },
						data: { InsuranceType: input.data.insuranceType },
					});

					break;
				}

				case "delete": {
					const currentItem = await ctx.db.cartItem.count({ where: { MaCartItem: input.MaCartItem } });

					if (!currentItem)
						throw new TRPCError({
							code: "UNPROCESSABLE_CONTENT",
							message: "Sản phảm không tồn tại trong giỏ hàng!",
						});

					await ctx.db.cartItem.delete({ where: { MaCartItem: input.MaCartItem } });
					break;
				}

				case "quanlity": {
					const currentItem = await ctx.db.cartItem.findFirst({
						where: { MaCartItem: input.MaCartItem },
						include: { SanPham: { include: { MatHang: true } } },
					});

					if (!currentItem)
						throw new TRPCError({
							code: "UNPROCESSABLE_CONTENT",
							message: "Sản phảm không tồn tại trong giỏ hàng!",
						});

					switch (input.data.option) {
						case "decrease": {
							if (currentItem.Quantity - 1 <= 0) {
								throw new TRPCError({
									code: "BAD_REQUEST",
									message: "Số lượng sản phẩm không thể bé hơn 0",
								});
							}

							await ctx.db.cartItem.update({
								where: { MaCartItem: input.MaCartItem },
								data: { Quantity: { decrement: 1 } },
							});

							break;
						}

						case "increase": {
							if (currentItem.Quantity + 1 > currentItem.SanPham.MatHang!.TonKho) {
								throw new TRPCError({
									code: "BAD_REQUEST",
									message:
										"Số lượng sản phẩm không thể lớn hơn " + currentItem.SanPham.MatHang!.TonKho,
								});
							}

							await ctx.db.cartItem.update({
								where: { MaCartItem: input.MaCartItem },
								data: { Quantity: { increment: 1 } },
							});

							break;
						}
					}

					break;
				}
			}
		}),
});
