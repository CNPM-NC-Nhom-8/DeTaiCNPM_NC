/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import type { createTRPCContext } from "./context";
import type { AppRouter } from "./routers";

import { type NextRequest } from "next/server";

import { TRPCError, type inferRouterInputs, type inferRouterOutputs, initTRPC } from "@trpc/server";

import superjson from "superjson";
import { ZodError } from "zod";

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

const isAuthed = t.middleware(({ next, ctx }) => {
	if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED", message: "Bạn cần đăng nhập để tiếp tục." });

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

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(isAuthed);
export const staffProcedure = t.procedure.use(isStaff);
export const adminProcedure = t.procedure.use(isAdmin);

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
