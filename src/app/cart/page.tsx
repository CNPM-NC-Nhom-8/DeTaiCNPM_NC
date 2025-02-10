import { CartFooter } from "@/components/cart/CartFooter";
import { CartItem } from "@/components/cart/CartItem";
import { CartNav } from "@/components/cart/Nav";
import { api } from "@/utils/trpc/server";

import Link from "next/link";

import { Button } from "@nextui-org/react";

import { ShoppingCart } from "lucide-react";

export default async function Page() {
	const cart = await api.cart.getCartItems();

	return (
		<main className="container flex max-w-2xl flex-grow flex-col gap-4 px-6 pt-4">
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
				<>
					<section className="flex flex-grow flex-col gap-4">
						{cart.map((item) => {
							return <CartItem key={item.MaCartItem} item={item} />;
						})}
					</section>

					<CartFooter cart={cart} />
				</>
			)}
		</main>
	);
}
