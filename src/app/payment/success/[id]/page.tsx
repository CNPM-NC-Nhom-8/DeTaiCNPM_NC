import { api } from "@/utils/trpc/server";

import Link from "next/link";
import { redirect } from "next/navigation";

import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";

import { LucideBadgeCheck } from "lucide-react";

export default async function Page({ params: { id } }: { params: { id: string } }) {
	const paymentDetail = await api.taiKhoan.getPaymentDetails({ MaDonHang: id });
	if (!paymentDetail) redirect("/cart");

	return (
		<main className="container flex max-w-2xl flex-grow items-center gap-4 px-6 pt-4">
			<Card className="w-full" shadow="sm">
				<CardBody className="py-10">
					<div className="flex flex-col items-center justify-center gap-4 text-lg font-semibold text-success">
						<LucideBadgeCheck size={100} />
						<h2>Thanh toán thành công!</h2>
						<p>
							Đơn hàng &quot;{paymentDetail.MaDonHang.split("-").at(0)}&quot; sẽ được giao tới địa chỉ của
							bạn!
						</p>
					</div>
				</CardBody>

				<CardFooter className="flex flex-wrap items-center justify-center gap-4 pb-10">
					<Button as={Link} href="/" color="primary" variant="shadow">
						Mua tiếp
					</Button>
				</CardFooter>
			</Card>
		</main>
	);
}
