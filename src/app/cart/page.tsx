import { CartFooter } from "@/components/cart/cart-footer";
import { CartItem } from "@/components/cart/cart-item";
import { BackButton } from "@/components/common/back-button";
import { Button } from "@/components/ui/button";

import type { RouterOutputs } from "@/utils/trpc/react";
import { api } from "@/utils/trpc/server";

import Link from "next/link";

import { ShoppingCart } from "lucide-react";

export default async function Page() {
	const cart = await api.cart.getCartItems();

	return (
		<main className="container flex max-w-6xl flex-grow flex-col items-center justify-center gap-4 px-6 py-4">
			<nav className="flex w-full items-center justify-between">
				<BackButton />
				<h3 className="justify-center text-2xl font-semibold">Giỏ hàng của bạn ({cart.length})</h3>

				<span></span>
			</nav>

			<div className="flex w-full max-w-2xl flex-grow flex-col items-center justify-center gap-2">
				{cart.length === 0 ? <EmptyCart /> : <ListItemCart cart={cart} />}
				<CartFooter cart={cart} />
			</div>
		</main>
	);
}

function ListItemCart({ cart }: { cart: RouterOutputs["cart"]["getCartItems"] }) {
	return (
		<section className="flex w-full flex-grow flex-col gap-2">
			{cart.map((item) => (
				<CartItem key={item.MaCartItem} item={item} />
			))}
		</section>
	);
}

function EmptyCart() {
	return (
		<section className="flex flex-grow flex-col items-center justify-center gap-2">
			<div className="flex w-full flex-col items-center justify-center">
				<ShoppingCart size={48} absoluteStrokeWidth />

				<span>Giỏ hàng của bạn đang trống</span>
				<span>Hãy chọn thêm sản phẩm để mua sắm nhé</span>
			</div>

			<div>
				<Button asChild>
					<Link href="/">Quay về trang chủ</Link>
				</Button>
			</div>
		</section>
	);
}
