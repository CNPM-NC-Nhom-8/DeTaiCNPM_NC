"use client";

import { moneyFormat } from "@/utils/common";
import type { RouterOutputs } from "@/utils/trpc/react";

import { InsuranceTypeOptions } from "../phone/data";

import Link from "next/link";

import { Card, CardBody, Image, Select, SelectItem } from "@nextui-org/react";

export const PaymentItem = ({ item }: { item: RouterOutputs["cart"]["getCartItems"][number] }) => {
	const insuranceType = InsuranceTypeOptions.find(({ type }) => type === item.InsuranceType);

	return (
		<Card>
			<CardBody className="gap-4">
				<section className="flex">
					<Link
						className="flex w-2/3 gap-4"
						href={"/phone/" + encodeURIComponent(item.SanPham.SanPhamMau.TenSP)}
					>
						<Image
							src={item.SanPham.SanPhamMau.AnhBia}
							classNames={{ wrapper: "h-24 aspect-square" }}
							alt={item.SanPham.SanPhamMau.TenSP}
						/>

						<div className="flex flex-grow flex-col justify-between gap-2">
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

					<div className="relative flex flex-grow flex-col items-end justify-end gap-2">
						<span>Số lượng: {item.Quantity}</span>
					</div>
				</section>

				<section>
					<Select
						size="sm"
						items={[...InsuranceTypeOptions, { price: 0, type: "None", description: "Không có" }]}
						defaultSelectedKeys={[item.InsuranceType]}
						isDisabled
						labelPlacement="outside"
					>
						{(item) => (
							<SelectItem key={item.type} description={item.description.split(": ")[1]}>
								{item.description.split(": ")[0] + " - " + moneyFormat.format(item.price)}
							</SelectItem>
						)}
					</Select>
				</section>
			</CardBody>
		</Card>
	);
};
