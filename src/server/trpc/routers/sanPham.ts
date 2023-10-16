import z from "zod";
import { router, publicProcedure, authProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { exclude } from "@/utils/excludeFields";

export const sanPhamRouter = router({
	getSanPham: publicProcedure
		.input(
			z.object({
				tenSP: z.string().optional(),
				maSPM: z.string().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			if (!input.maSPM && !input.tenSP) {
				const data = await ctx.prisma.sanPhamMau.findFirst({
					include: {
						HinhAnh: true,
						SanPhamBienThe: true,
						ThongSoKyThuat: true,
						FAQ: true,
					},
				});

				if (!data) throw new TRPCError({ code: "NOT_FOUND" });
				return { ...data, ThongSoKyThuat: exclude(data.ThongSoKyThuat!, ["MaSPM", "MaThongSo"]) };
			}

			const data = await ctx.prisma.sanPhamMau.findUnique({
				where: { TenSP: input.tenSP ? decodeURIComponent(input.tenSP) : undefined, MaSPM: input.maSPM },
				include: {
					HinhAnh: true,
					SanPhamBienThe: true,
					ThongSoKyThuat: true,
					FAQ: true,
				},
			});

			if (!data) throw new TRPCError({ code: "NOT_FOUND" });
			return { ...data, ThongSoKyThuat: exclude(data.ThongSoKyThuat!, ["MaSPM", "MaThongSo"]) };
		}),
	getSanPhamTuongTu: publicProcedure.input(z.object({ maHSX: z.string() })).query(async ({ ctx, input }) => {
		return await ctx.prisma.hangSanXuat.findFirst({
			where: { MaHSX: input.maHSX },
			include: { SanPhamMau: { take: 5, include: { SanPhamBienThe: true } } },
		});
	}),

	checkThichSP: publicProcedure.input(z.object({ maSPM: z.string() })).query(async ({ ctx, input }) => {
		if (!ctx.userId) return false;
		return !!(await ctx.prisma.sanPhamYeuThich.count({ where: { MaKhachHang: ctx.userId, MaSPM: input.maSPM } }));
	}),
	yeuThich: authProcedure.input(z.object({ maSPM: z.string() })).mutation(async ({ ctx, input }) => {
		const isFavorite = await ctx.prisma.sanPhamYeuThich.count({
			where: { MaSPM: input.maSPM, MaKhachHang: ctx.userId },
		});

		// đã yêu thích => bỏ yêu thích
		if (isFavorite) {
			await ctx.prisma.sanPhamYeuThich.delete({
				where: { MaSPM_MaKhachHang: { MaSPM: input.maSPM, MaKhachHang: ctx.userId } },
			});
			return;
		}
		// Chưa Yêu thích => Yêu Thích
		await ctx.prisma.sanPhamYeuThich.create({
			data: { MaSPM: input.maSPM, MaKhachHang: ctx.userId },
		});
	}),
});
