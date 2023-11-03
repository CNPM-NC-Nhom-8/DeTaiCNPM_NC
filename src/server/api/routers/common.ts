import { createTRPCRouter, publicProcedure } from "../trpc";

import type { Role } from "@prisma/client";

import z from "zod";

export const commonRouter = createTRPCRouter({
	getLoaiKH: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.loaiKhachHang.findMany();
	}),

	getHangSX: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.hangSanXuat.findMany();
	}),

	getCurrentUser: publicProcedure
		.input(z.object({ allowedRoles: z.array(z.custom<Role>()).optional() }).optional())
		.query(async ({ ctx, input }) => {
			if (!ctx.userId) return null;

			const user = await ctx.db.taiKhoan.findUnique({
				where: { MaTaiKhoan: ctx.userId },
				include: { KhachHang: true },
			});
			if (!user) return null;

			if (!input?.allowedRoles) return user;
			if (input.allowedRoles.includes(user.Role)) return user;

			return null;
		}),
});
