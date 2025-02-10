import { authProcedure, createTRPCRouter, publicProcedure } from "../trpc";

import z from "zod";

export const taiKhoanRouter = createTRPCRouter({
	getTaiKhoan: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.user.userId) return null;

		return await ctx.db.taiKhoan.findFirst({
			where: { MaTaiKhoan: ctx.user.userId },
			include: { KhachHang: true },
		});
	}),

	getPaymentHistories: authProcedure.input(z.object({ limit: z.number() })).query(async ({ ctx, input }) => {
		return await ctx.db.donHang.findMany({
			where: { maKhachHang: ctx.user.userId },
			include: {
				_count: { select: { CT_DonHang: true } },
				CT_DonHang: {
					include: { SanPham: { include: { SanPhamMau: true } } },
					take: input.limit,
					orderBy: [
						{ SanPham: { SanPhamMau: { TenSP: "asc" } } },
						{ SanPham: { DungLuong: "asc" } },
						{ SanPham: { Mau: "asc" } },
					],
				},
			},
			orderBy: { NgayDat: "desc" },
		});
	}),

	getPaymentDetails: authProcedure.input(z.object({ MaDonHang: z.string() })).query(async ({ ctx, input }) => {
		return await ctx.db.donHang.findFirst({
			where: { maKhachHang: ctx.user.userId, MaDonHang: input.MaDonHang },
			include: {
				_count: { select: { CT_DonHang: true } },
				CT_DonHang: {
					include: { SanPham: { include: { SanPhamMau: true } } },
					orderBy: [
						{ SanPham: { SanPhamMau: { TenSP: "asc" } } },
						{ SanPham: { DungLuong: "asc" } },
						{ SanPham: { Mau: "asc" } },
					],
				},
			},
		});
	}),
});
