import { createTRPCRouter, publicProcedure } from "../trpc";

export const taiKhoanRouter = createTRPCRouter({
	getTaiKhoan: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.userId) return null;

		return await ctx.db.taiKhoan.findFirst({
			where: { MaTaiKhoan: ctx.userId },
			include: { KhachHang: true },
		});
	}),
});
