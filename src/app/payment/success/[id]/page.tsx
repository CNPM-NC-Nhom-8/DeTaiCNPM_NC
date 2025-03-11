import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { api } from "@/utils/trpc/server";

import Link from "next/link";
import { redirect } from "next/navigation";

import { LucideBadgeCheck } from "lucide-react";

export default async function Page({ params: { id } }: { params: { id: string } }) {
	const paymentDetail = await api.taiKhoan.getPaymentDetails({ MaDonHang: id });
	if (!paymentDetail) redirect("/cart");

	return (
		<main className="container flex max-w-2xl flex-grow items-center gap-4 px-6 py-4">
			<Card className="w-full shadow-sm">
				<CardHeader className="flex flex-row items-center justify-center gap-2 text-success">
					<LucideBadgeCheck size={20} />
					<CardTitle className="text-lg font-semibold">Thanh toán thành công!</CardTitle>
					<LucideBadgeCheck size={20} />
				</CardHeader>

				<CardContent>
					<div className="flex flex-col items-center justify-center gap-4 text-center">
						<p>Đơn hàng &quot;{paymentDetail.MaDonHang}&quot; sẽ được giao tới địa chỉ của bạn!</p>
					</div>
				</CardContent>

				<CardFooter className="gap-2">
					<Button asChild className="w-full border border-border" variant="link">
						<Link href="/">Mua tiếp</Link>
					</Button>

					<Button asChild className="w-full border border-border" variant="link">
						<Link href={"/auth/account/history/payment/detail/" + paymentDetail.MaDonHang}>
							Xem đơn hàng
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</main>
	);
}
