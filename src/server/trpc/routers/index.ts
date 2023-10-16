import { router } from "../trpc";

import { danhGiaRouter } from "./danhGia";
import { sanPhamRouter } from "./sanPham";
import { taiKhoanRouter } from "./taiKhoan";
import { cartRouter } from "./cart"

export const appRouter = router({
	danhGia: danhGiaRouter,
	sanPham: sanPhamRouter,
	taiKhoan: taiKhoanRouter,
	cart: cartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
