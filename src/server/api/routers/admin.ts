import { env } from "@/env.mjs";

import { adminProcedure, createTRPCRouter } from "../trpc";

import { clerkClient } from "@clerk/nextjs";
import type { Prisma, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import z from "zod";

export const adminRouter = createTRPCRouter({
	loaiKHActions: adminProcedure
		.input(
			z.discriminatedUnion("type", [
				z.object({
					type: z.literal("Add"),
					TenLoaiTV: z.string().min(1, "Tên loại khách hàng phải dài hơn 1 ký tự"),
				}),
				z.object({
					type: z.literal("Edit"),
					MaLoaiKH: z.string(),
					TenLoaiTV: z.string().min(1, "Tên loại khách hàng phải dài hơn 1 ký tự"),
				}),
				z.object({
					type: z.literal("Delete"),
					MaLoaiKH: z.string(),
				}),
			]),
		)
		.mutation(async ({ ctx, input }) => {
			switch (input.type) {
				case "Add": {
					const existTenLoaiKH = await ctx.db.loaiKhachHang.count({
						where: { TenLoaiTV: input.TenLoaiTV },
					});

					if (!!existTenLoaiKH) {
						throw new TRPCError({ code: "BAD_REQUEST", message: "Tên loại khách hàng đã tồn tại" });
					}

					await ctx.db.loaiKhachHang.create({ data: { TenLoaiTV: input.TenLoaiTV } });
					break;
				}

				case "Edit": {
					const [existTenLoaiKH, currentLoaiKH] = await ctx.db.$transaction([
						ctx.db.loaiKhachHang.count({ where: { TenLoaiTV: input.TenLoaiTV } }),
						ctx.db.loaiKhachHang.count({ where: { MaLKH: input.MaLoaiKH } }),
					]);

					if (!currentLoaiKH) {
						throw new TRPCError({ code: "BAD_REQUEST", message: "Loại khách hàng không tồn tại" });
					}

					if (!!existTenLoaiKH) {
						throw new TRPCError({ code: "BAD_REQUEST", message: "Tên loại khách hàng đã tồn tại" });
					}

					await ctx.db.loaiKhachHang.update({
						where: { MaLKH: input.MaLoaiKH },
						data: { TenLoaiTV: input.TenLoaiTV },
					});

					break;
				}

				case "Delete": {
					const currentLoaiKH = await ctx.db.loaiKhachHang.findUnique({
						where: { MaLKH: input.MaLoaiKH },
						select: { _count: { select: { KhachHang: true } }, TenLoaiTV: true },
					});

					if (!currentLoaiKH) {
						throw new TRPCError({ code: "BAD_REQUEST", message: "Loại khách hàng không tồn tại" });
					}

					if (currentLoaiKH._count.KhachHang > 0) {
						throw new TRPCError({
							code: "CONFLICT",
							message: `Vẫn còn ${currentLoaiKH._count.KhachHang} khách hàng với loại khách hàng "${currentLoaiKH.TenLoaiTV}", vui lòng chuyển họ với 1 loại khách hàng khác trước khi xóa!`,
						});
					}

					await ctx.db.loaiKhachHang.delete({ where: { MaLKH: input.MaLoaiKH } });
					break;
				}
			}
		}),

	hangSXActions: adminProcedure
		.input(
			z.discriminatedUnion("type", [
				z.object({
					type: z.literal("Add"),
					tenHangSX: z.string().min(1, "Tên hãng sản xuất phải dài hơn 1 ký tự"),
				}),
				z.object({
					type: z.literal("Edit"),
					maHangSX: z.string(),
					tenHangSX: z.string().min(1, "Tên hãng sản xuất phải dài hơn 1 ký tự"),
				}),
				z.object({
					type: z.literal("Delete"),
					maHangSX: z.string(),
				}),
			]),
		)
		.mutation(async ({ ctx, input }) => {
			switch (input.type) {
				case "Add": {
					const existTenHangSX = await ctx.db.hangSanXuat.count({
						where: { TenHSX: input.tenHangSX },
					});

					if (!!existTenHangSX) {
						throw new TRPCError({ code: "BAD_REQUEST", message: "Tên hãng sản xuất đã tồn tại" });
					}

					await ctx.db.hangSanXuat.create({ data: { TenHSX: input.tenHangSX } });
					break;
				}

				case "Edit": {
					const [existTenHangSX, currentHangSX] = await ctx.db.$transaction([
						ctx.db.hangSanXuat.count({ where: { TenHSX: input.tenHangSX } }),
						ctx.db.hangSanXuat.count({ where: { MaHSX: input.maHangSX } }),
					]);

					if (!currentHangSX) {
						throw new TRPCError({ code: "BAD_REQUEST", message: "Hãng sản xuất không tồn tại" });
					}

					if (!!existTenHangSX) {
						throw new TRPCError({ code: "BAD_REQUEST", message: "Tên hãng sản xuất đã tồn tại" });
					}

					await ctx.db.hangSanXuat.update({
						where: { MaHSX: input.maHangSX },
						data: { TenHSX: input.tenHangSX },
					});

					break;
				}

				case "Delete": {
					const currentHangSX = await ctx.db.hangSanXuat.findUnique({
						where: { MaHSX: input.maHangSX },
						select: { _count: { select: { SanPhamMau: true } }, TenHSX: true },
					});

					if (!currentHangSX) {
						throw new TRPCError({ code: "BAD_REQUEST", message: "Hãng sản xuất không tồn tại" });
					}

					if (currentHangSX._count.SanPhamMau > 0) {
						throw new TRPCError({
							code: "CONFLICT",
							message: `Vẫn còn ${currentHangSX._count.SanPhamMau} sản phẩm với hãng sản xuất "${currentHangSX.TenHSX}", vui lòng chuyển những sản phẩm mẫu đó sang 1 hãng sản xuất khác trước khi xóa!`,
						});
					}

					await ctx.db.hangSanXuat.delete({ where: { MaHSX: input.maHangSX } });
					break;
				}
			}
		}),

	updateUser: adminProcedure
		.input(
			z.object({
				maTaiKhoan: z.string(),
				data: z.discriminatedUnion("type", [
					z.object({
						type: z.literal("Update"),
						role: z.custom<Role>().optional(),
						maLKH: z.string().optional(),
					}),
					z.object({ type: z.literal("Delete") }),
					z.object({ type: z.literal("Ban") }),
					z.object({ type: z.literal("Unban") }),
				]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			switch (input.data.type) {
				case "Update": {
					const currentUser = await ctx.db.taiKhoan.findFirst({
						where: { MaTaiKhoan: input.maTaiKhoan },
					});

					if (!currentUser)
						throw new TRPCError({ code: "UNPROCESSABLE_CONTENT", message: "Tài khoản không tồn tại!" });

					await ctx.db.taiKhoan.update({
						where: { MaTaiKhoan: input.maTaiKhoan },
						data: { Role: input.data.role, KhachHang: { update: { MaLKH: input.data.maLKH } } },
					});

					break;
				}
				case "Delete": {
					const currentUser = await ctx.db.taiKhoan.findFirst({
						where: { MaTaiKhoan: input.maTaiKhoan },
					});

					if (!currentUser)
						throw new TRPCError({ code: "UNPROCESSABLE_CONTENT", message: "Tài khoản không tồn tại!" });

					if (currentUser.Role === "NhanVien" || currentUser.Role === "QuanTriVien")
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: `Không thể xóa tài khoản với chức vụ "Nhân Viên" hoặc "Quản trị viên", vui lòng kiểm tra lại, hoặc cập nhật chức vụ người dùng và thử lại!`,
						});

					await ctx.db.taiKhoan.delete({ where: { MaTaiKhoan: input.maTaiKhoan } });
					await clerkClient.users.deleteUser(input.maTaiKhoan);

					break;
				}

				case "Ban":
				case "Unban": {
					const currentUser = await ctx.db.taiKhoan.findFirst({
						where: { MaTaiKhoan: input.maTaiKhoan },
					});

					if (!currentUser)
						throw new TRPCError({ code: "UNPROCESSABLE_CONTENT", message: "Tài khoản không tồn tại!" });

					if (
						(currentUser.Role === "NhanVien" || currentUser.Role === "QuanTriVien") &&
						input.data.type === "Ban"
					)
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: `Không thể cấm tài khoản với chức vụ "Nhân Viên" hoặc "Quản trị viên", vui lòng kiểm tra lại, hoặc cập nhật chức vụ người dùng và thử lại!`,
						});

					// NOTE: Clerk không có tính năng ban/unban, nên phải tự fetch tới api endpoint của clerk, và update db của mình
					const res = await fetch(
						`https://api.clerk.com/v1/users/${input.maTaiKhoan}/${input.data.type.toLowerCase()}`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Connection: "keep-alive",
								Authorization: "Bearer " + env.CLERK_SECRET_KEY,
							},
						},
					);

					if (res.ok) {
						await ctx.db.taiKhoan.update({
							where: { MaTaiKhoan: input.maTaiKhoan },
							data: { Banned: input.data.type === "Ban" },
						});
					}

					break;
				}
			}
		}),

	getUsers: adminProcedure
		.input(
			z.object({
				page: z.number(),
				perPage: z.number(),
				query: z.optional(
					z.object({
						value: z.string(),
						type: z.enum(["Search-ID", "Search-Name", "Search-Email", "Search-SDT"]),

						select: z.object({
							roles: z.custom<Role>().array(),
							loaiKH: z.string().array(),
						}),
					}),
				),
			}),
		)
		.query(async ({ ctx, input }) => {
			const nullPhoneNumbers = ["Không Có".toLowerCase(), "null", "undefined"];
			const trimedValue = (input.query?.value ?? "").trim();

			const search: Prisma.TaiKhoanWhereInput = {
				AND: [
					input.query && input.query.select.roles.length > 0
						? { OR: input.query.select.roles.map((role) => ({ Role: role })) }
						: {},
					input.query && input.query.select.loaiKH.length > 0
						? { OR: input.query.select.loaiKH.map((type) => ({ KhachHang: { MaLKH: type } })) }
						: {},
					input.query && trimedValue.length > 0
						? {
								...(input.query.type === "Search-ID"
									? { MaTaiKhoan: { contains: trimedValue, mode: "insensitive" } }
									: input.query.type === "Search-Email"
									? { Email: { contains: trimedValue, mode: "insensitive" } }
									: input.query.type === "Search-Name"
									? { TenTaiKhoan: { contains: trimedValue, mode: "insensitive" } }
									: {
											SDT: nullPhoneNumbers.includes(trimedValue)
												? null
												: { contains: trimedValue, mode: "insensitive" },
									  }),
						  }
						: {},
				],
			};

			const [userCount, userData] = await ctx.db.$transaction([
				ctx.db.taiKhoan.count({ where: search }),
				ctx.db.taiKhoan.findMany({
					where: search,
					include: { KhachHang: { include: { LoaiKhachHang: true } } },
					take: input.perPage,
					skip: Math.abs(input.page - 1) * input.perPage,
				}),
			]);

			const data = userData.map((_user) => {
				const { KhachHang: _KhachHang, ...user } = _user;
				const { LoaiKhachHang, ...KhachHang } = _KhachHang!;

				return { ...user, ...KhachHang, ...LoaiKhachHang };
			});

			return { data, count: userCount };
		}),

	getProducts: adminProcedure
		.input(
			z.object({
				page: z.number(),
				perPage: z.number(),
				query: z.optional(
					z.object({
						type: z.enum(["Search-ID", "Search-Name"]),
						value: z.string(),

						select: z.object({
							hangSX: z.string().array(),
						}),
					}),
				),
			}),
		)
		.query(async ({ ctx, input }) => {
			const trimedValue = (input.query?.value ?? "").trim();

			const search: Prisma.SanPhamMauWhereInput = {
				AND: [
					input.query && input.query.select.hangSX.length > 0
						? { OR: input.query.select.hangSX.map((maHSX) => ({ MaHSX: maHSX })) }
						: {},
					input.query && trimedValue.length > 0
						? {
								...(input.query.type === "Search-ID"
									? { MaSPM: { contains: trimedValue, mode: "insensitive" } }
									: input.query.type === "Search-Name"
									? { TenSP: { contains: trimedValue, mode: "insensitive" } }
									: {}),
						  }
						: {},
				],
			};

			const [productCount, productsData] = await ctx.db.$transaction([
				ctx.db.sanPhamMau.count({ where: search }),
				ctx.db.sanPhamMau.findMany({
					where: search,
					include: { SanPhamBienThe: true, ThongSoKyThuat: true, HSX: true },
					take: input.perPage,
					skip: Math.abs(input.page - 1) * input.perPage,
				}),
			]);

			const data = productsData.map((_product) => {
				const { SanPhamBienThe, HSX, ThongSoKyThuat, ...product } = _product;

				return { ...product, SanPhamBienThe, ...HSX, ThongSoKyThuat };
			});

			return { data, count: productCount };
		}),

	updateProduct: adminProcedure
		.input(
			z.object({
				maSPM: z.string(),
				data: z.discriminatedUnion("type", [
					z.object({
						type: z.literal("Update"),
						MaHangSX: z.string().optional(),
					}),
					z.object({ type: z.literal("Delete") }),
				]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			switch (input.data.type) {
				case "Update": {
					const currentProduct = await ctx.db.sanPhamMau.findFirst({
						where: { MaSPM: input.maSPM },
					});

					if (!currentProduct)
						throw new TRPCError({ code: "UNPROCESSABLE_CONTENT", message: "Sản phẩm không tồn tại!" });

					await ctx.db.sanPhamMau.update({
						where: { MaSPM: input.maSPM },
						data: { MaHSX: input.data.MaHangSX },
					});

					break;
				}
			}
		}),
});
