import { adminRouter } from "./routers/admin";
import { cartRouter } from "./routers/cart";
import { commonRouter } from "./routers/common";
import { danhGiaRouter } from "./routers/danhGia";
import { sanPhamRouter } from "./routers/sanPham";
import { taiKhoanRouter } from "./routers/taiKhoan";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	danhGia: danhGiaRouter,
	sanPham: sanPhamRouter,
	taiKhoan: taiKhoanRouter,
	cart: cartRouter,
	admin: adminRouter,
	common: commonRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
