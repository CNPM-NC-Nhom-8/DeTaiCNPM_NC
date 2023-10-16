import z from "zod";

import { authProcedure, publicProcedure, router } from "../trpc";
import type { Insurance } from "@prisma/client";

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
			//
		}),
	layGioHang: authProcedure.query(async ({ ctx }) => {
		return ctx.prisma.cartItem.findMany({
			where: { MaKhachHang: ctx.userId },
			include: { SanPham: true },
		});
	}),
});
