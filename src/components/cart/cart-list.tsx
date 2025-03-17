"use client";

import { Button } from "@/components/ui/button";

import { api } from "@/utils/trpc/react";

import { CartFooter } from "./cart-footer";
import { CartItem } from "./cart-item";

import Link from "next/link";

import { ShoppingCart } from "lucide-react";

export function ListItemCart() {
	const [cart] = api.cart.getCartItems.useSuspenseQuery();
	if (cart.length === 0) return <EmptyCart />;

	return (
		<>
			<section className="flex w-full flex-grow flex-col gap-2">
				{cart.map((item, index) => (
					<CartItem key={item.MaCartItem} item={item} index={index + 1} />
				))}
			</section>

			<CartFooter cart={cart} />
		</>
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
