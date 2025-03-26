import { BackButton } from "@/components/common/back-button";
import { PaymentFooter } from "@/components/payment/PaymentFooter";
import { PaymentItem } from "@/components/payment/PaymentItem";

import { api } from "@/utils/trpc/server";

import { redirect } from "next/navigation";

export default async function Page() {
	const user = await api.common.getCurrentUser();
	const cart = await api.cart.getCartItems();

	if (cart.length === 0) redirect("/cart");

	return (
		<main className="container flex max-w-2xl flex-grow flex-col gap-4 px-6 py-4">
			<nav className="flex w-full items-center justify-between">
				<BackButton />
				<h3 className="justify-center text-2xl font-semibold">Thanh toán ({cart.length})</h3>

				<span></span>
			</nav>

			<section className="flex flex-grow flex-col gap-4">
				{cart.map((item) => (
					<PaymentItem key={item.MaCartItem} item={item} />
				))}
			</section>

			<PaymentFooter cart={cart} defaultAddress={user?.KhachHang?.DiaChi} />
		</main>
	);
}
