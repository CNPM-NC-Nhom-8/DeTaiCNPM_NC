import { ListItemCart } from "@/components/cart/cart-list";
import { BackButton } from "@/components/common/back-button";

import { HydrateClient, api } from "@/utils/trpc/server";

export default async function Page() {
	const amount = await api.cart.getCartAmount();
	void api.cart.getCartItems.prefetch();

	return (
		<main className="container flex max-w-6xl flex-grow flex-col items-center justify-center gap-4 px-6 py-4">
			<nav className="flex w-full items-center justify-between">
				<BackButton />
				<h3 className="justify-center text-2xl font-semibold">Giỏ hàng của bạn ({amount})</h3>

				<span></span>
			</nav>

			<div className="flex w-full max-w-2xl flex-grow flex-col items-center justify-center gap-2">
				<HydrateClient>
					<ListItemCart />
				</HydrateClient>
			</div>
		</main>
	);
}
