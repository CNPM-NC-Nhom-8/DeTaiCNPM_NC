import { createTRPCRouter, publicProcedure, staffProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";

import z from "zod";

export const danhGiaRouter = createTRPCRouter({
	getTraLoi: publicProcedure.input(z.object({ maDanhGia: z.string() })).query(async ({ ctx, input }) => {
		return await ctx.db.danhGia.findMany({
			where: { MaTraLoi: input.maDanhGia },
			include: { KhachHang: { include: { TaiKhoan: true } }, _count: { select: { TraLoiBoi: true } } },
		});
	}),

	getDanhGia: publicProcedure
		.input(z.object({ maSPM: z.string(), pageNum: z.number() }))
		.query(async ({ ctx, input }) => {
			return await ctx.db.danhGia.findMany({
				where: { MaSPM: input.maSPM, MaTraLoi: null },
				orderBy: { NgayDanhGia: "desc" },
				include: { KhachHang: { include: { TaiKhoan: true } }, _count: { select: { TraLoiBoi: true } } },
				take: input.pageNum * 5,
			});
		}),

	deleteDanhGia: staffProcedure.input(z.object({ maDanhGia: z.string() })).mutation(async ({ ctx, input }) => {
		const data = await ctx.db.danhGia.findUnique({ where: { MaDanhGia: input.maDanhGia } });

		if (!data) throw new TRPCError({ code: "BAD_REQUEST", message: "Không tìm thấy đánh giá" });
		await ctx.db.danhGia.delete({ where: { MaDanhGia: data.MaDanhGia } });
	}),

	danhGiaBanTin: publicProcedure
		.input(
			z.object({
				maSPM: z.string(),
				noiDung: z.string(),
				maTraLoi: z.string().optional(),
				maKhachHang: z.string().optional(),
				tenKhachHang: z.string().optional(),
				soSao: z.number().min(1).max(5),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.danhGia.create({
				data: {
					MaSPM: input.maSPM,
					NoiDungDG: input.noiDung,
					SoSao: input.soSao,

					MaTraLoi: input.maTraLoi,
					MaKhachHang: input.maKhachHang,
					TenKhachHang: input.tenKhachHang,
				},
			});
		}),
});
