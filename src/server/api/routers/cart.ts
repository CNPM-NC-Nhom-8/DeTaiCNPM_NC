import { authProcedure, createTRPCRouter, publicProcedure } from "../trpc";

import type { Insurance } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import z from "zod";

export const cartRouter = createTRPCRouter({
	addItemIntoCart: authProcedure
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

	getCartItems: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.userId) return [];

		return ctx.db.cartItem.findMany({
			where: { MaKhachHang: ctx.userId },
			include: { SanPham: { include: { SanPhamMau: true } } },
		});
	}),

	updateCartItem: authProcedure
		.input(
			z.object({
				MaCartItem: z.string(),
				data: z.discriminatedUnion("type", [
					z.object({ type: z.literal("update"), insuranceType: z.custom<Insurance>() }),
					z.object({ type: z.literal("delete") }),
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
			}
		}),
});
