import { env } from "@/env.mjs";

import { adminProcedure, createTRPCRouter } from "../trpc";

import { clerkClient } from "@clerk/nextjs";
import type { Prisma, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import z from "zod";

export const adminRouter = createTRPCRouter({
	LoaiKHActions: adminProcedure
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
				search: z
					.object({
						query: z.object({
							queryType: z.enum(["Search-ID", "Search-Name", "Search-Email", "Search-SDT"]),
							value: z.string(),
						}),
						roles: z.custom<Role>().array(),
						type: z.string().array(),
					})
					.optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const nullPhoneNumbers = ["Không Có".toLowerCase(), "null", "undefined"];

			const trimedValue = (input.search?.query.value ?? "").trim();

			const search: Prisma.TaiKhoanWhereInput = {
				AND: [
					input.search && input.search.roles.length > 0
						? {
								OR: input.search.roles.map((role) => ({ Role: role })),
						  }
						: {},
					input.search && input.search.type.length > 0
						? {
								OR: input.search.type.map((type) => ({ KhachHang: { MaLKH: type } })),
						  }
						: {},
					input.search && trimedValue.length > 0
						? {
								...(input.search.query.queryType === "Search-ID"
									? { MaTaiKhoan: { contains: trimedValue, mode: "insensitive" } }
									: input.search.query.queryType === "Search-Email"
									? { Email: { contains: trimedValue, mode: "insensitive" } }
									: input.search.query.queryType === "Search-Name"
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

	getProductInfo: adminProcedure
		.input(
			z.object({
				page: z.number(),
				perPage: z.number(),
				search: z
					.object({
						query: z.object({
							queryType: z.enum(["Search-ID", "Search-Name", "Search-Email", "Search-SDT"]),
							value: z.string(),
						}),
					})
					.optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const search: Prisma.TaiKhoanWhereInput = {
				AND: [],
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
				return _product;
			});

			return { data, count: productCount };
		}),
});
