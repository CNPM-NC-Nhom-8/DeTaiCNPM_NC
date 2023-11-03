import { authProcedure, createTRPCRouter, publicProcedure } from "../trpc";

import type { Insurance } from "@prisma/client";

import z from "zod";

export const cartRouter = createTRPCRouter({
	themVaoGiohang: authProcedure
		.input(z.object({ maSP: z.string(), type: z.custom<Insurance>(), quanlity: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const existCartItem = await ctx.db.cartItem.findFirst({
				where: { MaSP: input.maSP, InsuranceType: input.type },
			});

			if (!existCartItem) {
				await ctx.db.cartItem.create({
					data: {
						Quantity: input.quanlity,
						InsuranceType: input.type,
						MaKhachHang: ctx.userId,
						MaSP: input.maSP,
					},
				});
				return;
			}

			await ctx.db.cartItem.update({
				data: { Quantity: { increment: input.quanlity } },
				where: { MaCartItem: existCartItem.MaCartItem },
			});
		}),

	layGioHang: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.userId) return [];

		return ctx.db.cartItem.findMany({
			where: { MaKhachHang: ctx.userId },
			include: { SanPham: { include: { SanPhamMau: true } } },
		});
	}),
});
