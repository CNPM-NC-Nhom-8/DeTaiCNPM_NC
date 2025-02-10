import { HistoryPaymentNav } from "@/components/history/HistoryPaymentNav";
import { HistoryPaymentTable } from "@/components/history/HistoryPaymentTable";
import { api } from "@/utils/trpc/server";

export default async function Page() {
	const data = await api.taiKhoan.getPaymentHistories({ limit: 2 });

	return (
		<main className="container flex max-w-2xl flex-grow flex-col gap-4 px-6 pt-4">
			<HistoryPaymentNav count={data.length} />

			<section className="flex flex-col items-center justify-center gap-4">
				{data.map((item) => (
					<HistoryPaymentTable key={item.MaDonHang} data={item} />
				))}
			</section>
		</main>
	);
}
