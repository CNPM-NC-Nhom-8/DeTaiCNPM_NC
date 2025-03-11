import { BackButton } from "@/components/common/back-button";
import { PaymentHistoryItem } from "@/components/history/payment-history-item";

import { api } from "@/utils/trpc/server";

export default async function Page() {
	const data = await api.taiKhoan.getPaymentHistories({ limit: 2 });

	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-4 px-6 py-4">
			<nav className="flex w-full items-center justify-between">
				<BackButton />
				<h3 className="justify-center text-2xl font-semibold">Lịch sử đặt hàng ({data.length})</h3>
				<span></span>
			</nav>

			<section className="flex items-center justify-center">
				<div className="flex max-w-2xl flex-1 flex-col items-center justify-center gap-2">
					{data.map((item) => (
						<PaymentHistoryItem key={item.MaDonHang} data={item} />
					))}
				</div>
			</section>
		</main>
	);
}
