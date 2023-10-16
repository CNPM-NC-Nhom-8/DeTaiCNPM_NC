import z from "zod";

import { authProcedure, publicProcedure, router } from "../trpc";

export const taiKhoanRouter = router({
	getTaiKhoan: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.userId) return null;

		return await ctx.prisma.taiKhoan.findFirst({
			where: { MaTaiKhoan: ctx.userId },
			include: { KhachHang: true },
		});
	}),
});
