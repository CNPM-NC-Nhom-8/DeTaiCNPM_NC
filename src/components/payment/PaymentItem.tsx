"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { moneyFormat } from "@/utils/common";
import type { RouterOutputs } from "@/utils/trpc/react";

import { InsuranceTypeOptions } from "../phone/data";

import Image from "next/image";
import Link from "next/link";

export const PaymentItem = ({ item }: { item: RouterOutputs["cart"]["getCartItems"][number] }) => {
	const insuranceType = InsuranceTypeOptions.find(({ type }) => type === item.InsuranceType);

	return (
		<Card>
			<CardContent className="flex p-3">
				<Link className="flex w-2/3 gap-4" href={"/phone/" + encodeURIComponent(item.SanPham.SanPhamMau.TenSP)}>
					<Image
						width={96}
						height={96}
						unoptimized
						src={item.SanPham.SanPhamMau.AnhBia}
						alt={item.SanPham.SanPhamMau.TenSP}
						className="w-24 rounded"
					/>

					<div className="flex flex-col justify-center gap-2">
						<div>
							<h3 className="text-lg font-semibold">{item.SanPham.SanPhamMau.TenSP}</h3>
							<span>
								{item.SanPham.DungLuong} - {item.SanPham.Mau}
							</span>
						</div>

						<div className="text-danger">
							<span>{moneyFormat.format(item.SanPham.Gia * item.Quantity)}</span>

							{insuranceType && insuranceType.type !== "None" && (
								<span className="text-small"> + {moneyFormat.format(insuranceType.price)}</span>
							)}
						</div>
					</div>
				</Link>

				<div className="relative flex flex-grow flex-col items-end gap-2">
					<Button variant="outline">Tồn kho: {item.SanPham.MatHang?.TonKho}</Button>
					<span className="text-sm">Số lượng: {item.Quantity}</span>
				</div>
			</CardContent>
		</Card>
	);
};
