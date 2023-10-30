import { authProcedure, publicProcedure, router } from "../trpc";

import type { Insurance } from "@prisma/client";

import z from "zod";

export const cartRouter = router({
	themVaoGiohang: authProcedure
		.input(
			z.object({
				maSP: z.string(),
				type: z.custom<Insurance>(),
				quanlity: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const existCartItem = await ctx.prisma.cartItem.findFirst({
				where: { MaSP: input.maSP, InsuranceType: input.type },
			});

			if (!existCartItem) {
				await ctx.prisma.cartItem.create({
					data: {
						Quantity: input.quanlity,
						InsuranceType: input.type,
						MaKhachHang: ctx.userId,
						MaSP: input.maSP,
					},
				});
				return;
			}

			await ctx.prisma.cartItem.update({
				data: { Quantity: { increment: input.quanlity } },
				where: { MaCartItem: existCartItem.MaCartItem },
			});
		}),
	layGioHang: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.userId) return [];

		return ctx.prisma.cartItem.findMany({
			where: { MaKhachHang: ctx.userId },
			include: { SanPham: { include: { SanPhamMau: true } } },
		});
	}),
});
