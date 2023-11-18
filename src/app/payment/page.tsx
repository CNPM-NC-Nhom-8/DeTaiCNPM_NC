import { PaymentFooter } from "@/components/payment/PaymentFooter";
import { PaymentItem } from "@/components/payment/PaymentItem";
import { PaymentNav } from "@/components/payment/PaymentNav";
import { api } from "@/utils/trpc/server";

import { redirect } from "next/navigation";

export default async function Page() {
	const cart = await api.cart.getCartItems.query();
	if (cart.length === 0) redirect("/cart");

	return (
		<main className="container flex max-w-2xl flex-grow flex-col gap-4 px-6 pt-4">
			<PaymentNav count={cart.length} />

			<section className="flex flex-grow flex-col gap-4">
				{cart.map((item) => {
					return <PaymentItem key={item.MaCartItem} item={item} />;
				})}
			</section>

			<PaymentFooter cart={cart} />
		</main>
	);
}
