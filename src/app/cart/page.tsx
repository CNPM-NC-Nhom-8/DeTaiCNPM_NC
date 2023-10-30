import { CartItem } from "@/components/Cart/CartItem";
import { CartNav } from "@/components/Cart/Nav";
import { trpc } from "@/utils/trpc/server";

import Link from "next/link";

import { currentUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";

import { ShoppingCart } from "lucide-react";

export default async function Page() {
	const moneyFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "vnd" });

	const user = (await currentUser())!;
	const cart = await trpc.cart.layGioHang.query();

	return (
		<main className="container flex max-w-5xl flex-grow flex-col gap-4 px-6 py-4">
			<CartNav cartLength={cart.length} />

			{cart.length === 0 && (
				<section className="flex flex-grow flex-col items-center justify-center gap-2">
					<div className="flex w-full flex-col items-center justify-center">
						<ShoppingCart size={48} absoluteStrokeWidth />

						<span>Giỏ hàng của bạn đang trống</span>
						<span>Hãy chọn thêm sản phẩm để mua sắm nhé</span>
					</div>

					<div>
						<Button as={Link} href={"/"} color="primary">
							Quay về trang chủ
						</Button>
					</div>
				</section>
			)}

			{cart.length > 0 && (
				<section>
					{cart.map((item) => {
						return <CartItem key={item.MaCartItem} cartItem={item} />;
					})}
				</section>
			)}
		</main>
	);
}
