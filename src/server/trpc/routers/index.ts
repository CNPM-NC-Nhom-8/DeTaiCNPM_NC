import { router } from "../trpc";
import { adminRouter } from "./admin";
import { cartRouter } from "./cart";
import { danhGiaRouter } from "./danhGia";
import { sanPhamRouter } from "./sanPham";
import { taiKhoanRouter } from "./taiKhoan";

export const appRouter = router({
	danhGia: danhGiaRouter,
	sanPham: sanPhamRouter,
	taiKhoan: taiKhoanRouter,
	cart: cartRouter,
	admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
