import { TRPCError, initTRPC, type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./context";
import type { AppRouter } from "./routers";

export const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter: ({ shape }) => shape,
});

const isAuthed = t.middleware(({ next, ctx }) => {
	if (!ctx.userId) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Bạn cần đăng nhập để tiếp tục." });
	}
	return next({ ctx: { ...ctx, userId: ctx.userId } });
});

const isStaff = isAuthed.unstable_pipe(async ({ next, ctx }) => {
	const data = await ctx.prisma.taiKhoan.findUnique({ where: { MaTaiKhoan: ctx.userId } });

	if (!data)
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Vui lòng liên hệ với quản trị viên nếu bạn gặp lỗi này",
		});
	if (data.Role !== "NhanVien" && data.Role !== "QuanTriVien")
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Bạn không có quyền thực hiện hành động này. Yêu cầu chức vụ: Nhân Viên | Quản trị viên",
		});

	return next({ ctx: { ...ctx, userId: ctx.userId } });
});

const isAdmin = isStaff.unstable_pipe(async ({ next, ctx }) => {
	const data = await ctx.prisma.taiKhoan.findUnique({ where: { MaTaiKhoan: ctx.userId } });

	if (!data)
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Vui lòng liên hệ với quản trị viên nếu bạn gặp lỗi này",
		});
	if (data.Role !== "QuanTriVien")
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Bạn không có quyền thực hiện hành động này. Yêu cầu chức vụ: Quản trị viên",
		});

	return next({ ctx: { ...ctx, userId: ctx.userId } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(isAuthed);
export const staffProcedure = t.procedure.use(isStaff);
export const adminProcedure = t.procedure.use(isAdmin);

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
