import { moneyFormat } from "@/utils/common";
import type { RouterOutputs } from "@/utils/trpc/react";

import { InsuranceTypeOptions } from "../phone/data";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

import Image from "next/image";
import Link from "next/link";

type PaymentHistoryData = { data: RouterOutputs["taiKhoan"]["getPaymentHistories"][number] };

export function PaymentHistoryItem({ data }: PaymentHistoryData) {
	return (
		<Card className="w-full">
			<CardContent className="flex w-full flex-col gap-2 p-4">
				<section className="flex flex-col gap-2">
					{data.CT_DonHang.map((item) => (
						<PaymentDetailItem key={item.MaCT_DH} data={item} />
					))}

					{data._count.CT_DonHang > 2 && (
						<div className="text-center text-small text-gray">
							<span>Còn {data._count.CT_DonHang - 2} sản phẩm nữa...</span>
						</div>
					)}
				</section>

				<hr />
				<section className="flex w-full justify-between">
					<div className="flex items-center gap-2">
						<span className="text-small">Tổng số tiền:</span>
						<span className="text-lg text-danger">{moneyFormat.format(data.TongTien)}</span>
					</div>

					<Button asChild>
						<Link href={`/auth/account/history/payment/detail/${data.MaDonHang}`}>Xem chi tiết</Link>
					</Button>
				</section>
			</CardContent>
		</Card>
	);
}

function PaymentDetailItem({ data }: { data: PaymentHistoryData["data"]["CT_DonHang"][number] }) {
	const insurance = InsuranceTypeOptions.find(({ type }) => type === data.InsuranceType);

	return (
		<div className="flex gap-4">
			<Image
				width={120}
				height={120}
				unoptimized
				className="aspect-square rounded object-cover object-center"
				alt={data.SanPham.SanPhamMau.MoTa}
				src={data.SanPham.SanPhamMau.AnhBia}
			/>

			<div className="flex w-full flex-col gap-2">
				<h2 className="text-lg font-semibold">{data.SanPham.SanPhamMau.TenSP}</h2>
				<span className="text-sm text-gray">
					Loại: {data.SanPham.DungLuong} - {data.SanPham.Mau}
				</span>

				<div className="flex gap-2 text-sm text-gray">
					<span>Số lượng: {data.SoLuong} -</span>
					<span>{moneyFormat.format(data.SanPham.Gia)}</span>
					<span> * {data.SoLuong}</span>
					<span>= {moneyFormat.format(data.SanPham.Gia * data.SoLuong)}</span>
				</div>

				<span className="text-small text-gray">
					Bảo hiểm: {insurance ? `${insurance.title} + ${moneyFormat.format(insurance.price)}` : "Không có"}
				</span>
			</div>
		</div>
	);
}
