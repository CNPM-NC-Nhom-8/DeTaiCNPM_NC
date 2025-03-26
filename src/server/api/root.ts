import { adminRouter } from "./routers/admin";
import { cartRouter } from "./routers/cart";
import { commentRouter } from "./routers/comment";
import { commonRouter } from "./routers/common";
import { productRouter } from "./routers/product";
import { taiKhoanRouter } from "./routers/taiKhoan";
import { createCallerFactory, createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	comment: commentRouter,
	product: productRouter,
	taiKhoan: taiKhoanRouter,
	cart: cartRouter,
	admin: adminRouter,
	common: commonRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
