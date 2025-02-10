import { createTRPCRouter, publicProcedure } from "../trpc";

import type { Role } from "@prisma/client";

import z from "zod";

export const commonRouter = createTRPCRouter({
	getLoaiKH: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.loaiKhachHang.findMany({ orderBy: { TenLoaiTV: "asc" } });
	}),

	getHangSX: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.hangSanXuat.findMany({ orderBy: { TenHSX: "asc" } });
	}),

	getCurrentUser: publicProcedure
		.input(z.object({ allowedRoles: z.array(z.custom<Role>()) }).optional())
		.query(async ({ ctx, input }) => {
			if (!ctx.user.userId) return null;

			const user = await ctx.db.taiKhoan.findUnique({
				where: { MaTaiKhoan: ctx.user.userId },
				include: { KhachHang: true },
			});
			if (!user) return null;

			if (!input?.allowedRoles) return user;
			if (input.allowedRoles.includes(user.Role)) return user;

			return null;
		}),
});
