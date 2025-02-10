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

	getSanPhamTuongTu: publicProcedure.input(z.object({ maHSX: z.string() })).query(async ({ ctx, input }) => {
		return await ctx.db.hangSanXuat.findFirst({
			where: { MaHSX: input.maHSX },
			include: { SanPhamMau: { take: 5, include: { SanPhamBienThe: true } } },
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
				pageNum: z.number().min(0, "Số trang phải lớn hơn 0"),
				perPage: z.number().min(1, "Số lượng từng trang phải lớn hơn 1"),
				query: z
					.object({
						value: z.string().optional(),
						hangSX: z.string().optional(),
					})
					.optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const trimValue = (input.query?.value ?? "").trim();

			const search: Prisma.SanPhamMauWhereInput = {
				AND: [
					input.query?.value
						? { OR: [{ TenSP: { contains: trimValue } }, { MoTa: { contains: trimValue } }] }
						: {},
					input.query?.hangSX ? { MaHSX: input.query.hangSX } : {},
				],
			};

			const [newsCount, newsData] = await ctx.db.$transaction([
				ctx.db.sanPhamMau.count({ where: search }),
				ctx.db.sanPhamMau.findMany({
					where: search,
					include: {
						HSX: true,
						SanPhamBienThe: true,
						_count: { select: { DanhGia: true } },
					},
					take: input.perPage,
					skip: Math.abs(input.pageNum - 1) * input.perPage,
				}),
			]);

			return { data: newsData, count: newsCount };
		}),
});
