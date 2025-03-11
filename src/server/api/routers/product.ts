import { exclude } from "@/utils/common";

import { authProcedure, createTRPCRouter, publicProcedure } from "../trpc";

import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import z from "zod";

export const productRouter = createTRPCRouter({
	getSanPham: publicProcedure
		.input(
			z.object({
				tenSP: z.string().optional(),
				maSPM: z.string().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			if (!input.maSPM && !input.tenSP) {
				const data = await ctx.db.sanPhamMau.findFirst({
					include: {
						HinhAnh: true,
						SanPhamBienThe: { include: { MatHang: true }, orderBy: [{ Gia: "asc" }, { Mau: "desc" }] },
						ThongSoKyThuat: true,
						FAQ: true,
					},
				});

				if (!data) throw new TRPCError({ code: "NOT_FOUND" });
				return { ...data, ThongSoKyThuat: exclude(data.ThongSoKyThuat!, ["MaSPM", "MaThongSo"]) };
			}

			const data = await ctx.db.sanPhamMau.findUnique({
				where: { TenSP: input.tenSP ? decodeURIComponent(input.tenSP) : undefined, MaSPM: input.maSPM },
				include: {
					HinhAnh: true,
					SanPhamBienThe: { include: { MatHang: true }, orderBy: [{ Gia: "asc" }, { Mau: "desc" }] },
					ThongSoKyThuat: true,
					FAQ: true,
				},
			});

			if (!data) throw new TRPCError({ code: "NOT_FOUND" });
			return { ...data, ThongSoKyThuat: exclude(data.ThongSoKyThuat!, ["MaSPM", "MaThongSo"]) };
		}),

	getSanPhamTuongTu: publicProcedure
		.input(z.object({ maSPM: z.string(), maHSX: z.string() }))
		.query(async ({ ctx, input }) => {
			const includeFavorite = ctx.user.userId ? { where: { MaKhachHang: ctx.user.userId } } : false;

			return await ctx.db.hangSanXuat.findFirst({
				where: { MaHSX: input.maHSX, SanPhamMau: { some: { MaSPM: { not: input.maSPM } } } },
				include: {
					SanPhamMau: {
						take: 5,
						include: { SanPhamBienThe: { include: { MatHang: true } }, SanPhamYeuThich: includeFavorite },
					},
				},
			});
		}),

	getSanPhamCu: publicProcedure.input(z.object({ maSPM: z.string() })).query(async ({ ctx, input }) => {
		const includeFavorite = ctx.user.userId ? { where: { MaKhachHang: ctx.user.userId } } : false;

		return await ctx.db.sanPhamMau.findMany({
			where: { MaSPM: { not: input.maSPM } },
			include: { SanPhamBienThe: { include: { MatHang: true } }, SanPhamYeuThich: includeFavorite },
			orderBy: { NgayThem: "desc" },
			take: 5,
		});
	}),

	checkThichSP: publicProcedure.input(z.object({ maSPM: z.string() })).query(async ({ ctx, input }) => {
		if (!ctx.user.userId) return false;
		return !!(await ctx.db.sanPhamYeuThich.count({ where: { MaKhachHang: ctx.user.userId, MaSPM: input.maSPM } }));
	}),

	yeuThich: authProcedure
		.input(z.object({ maSPM: z.string(), isFavored: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			// đã yêu thích => bỏ yêu thích
			if (input.isFavored) {
				await ctx.db.sanPhamYeuThich.delete({
					where: { MaSPM_MaKhachHang: { MaSPM: input.maSPM, MaKhachHang: ctx.user.userId } },
				});
				return;
			}

			// Chưa Yêu thích => Yêu Thích
			await ctx.db.sanPhamYeuThich.create({
				data: { MaSPM: input.maSPM, MaKhachHang: ctx.user.userId },
			});
		}),

	searchProduct: publicProcedure
		.input(
			z.object({
				pageIndex: z.number().min(0, "Số trang phải lớn hơn 0"),
				pageSize: z.number().min(1, "Số lượng từng trang phải lớn hơn 1"),
				query: z
					.object({
						value: z.string().nullish(),
						hangSX: z.string().nullish(),
					})
					.optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const search: Prisma.SanPhamMauWhereInput["AND"] = [];

			if (input.query?.hangSX) search.push({ MaHSX: input.query.hangSX });
			if (input.query?.value && input.query.value.length > 0)
				search.push({ TenSP: { contains: input.query.value.trim(), mode: "insensitive" } });

			const includeFavorite = ctx.user.userId ? { where: { MaKhachHang: ctx.user.userId } } : false;

			const [newsCount, newsData] = await ctx.db.$transaction([
				ctx.db.sanPhamMau.count({ where: { AND: search } }),
				ctx.db.sanPhamMau.findMany({
					take: input.pageSize,
					where: { AND: search },
					skip: Math.abs(input.pageIndex - 1) * input.pageSize,
					include: {
						HSX: true,
						SanPhamBienThe: { include: { MatHang: true } },
						SanPhamYeuThich: includeFavorite,
						_count: { select: { DanhGia: true } },
					},
				}),
			]);

			return { data: newsData, count: newsCount };
		}),
});
