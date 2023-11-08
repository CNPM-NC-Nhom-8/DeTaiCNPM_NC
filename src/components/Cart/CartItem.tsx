"use client";

import { moneyFormat } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import { InsuranceTypeOptions } from "../phone/data";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, Card, CardBody, Image, Select, SelectItem } from "@nextui-org/react";

import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export const CartItem = ({ item }: { item: RouterOutputs["cart"]["getCartItems"][number] }) => {
	const router = useRouter();
	const apiUtils = api.useUtils();

	const removeItem = api.cart.updateCartItem.useMutation({
		onSuccess: async () => {
			await apiUtils.cart.getCartItems.refetch();
			router.refresh();
		},
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

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

						<div className="flex flex-col justify-center gap-2">
							<div>
								<h3 className="text-lg font-semibold">{item.SanPham.SanPhamMau.TenSP}</h3>
								<span>
									{item.SanPham.DungLuong} - {item.SanPham.Mau}
								</span>
							</div>

							<span className="text-danger">{moneyFormat.format(item.SanPham.Gia)}</span>
						</div>
					</Link>

					<div className="relative flex flex-grow flex-col items-end gap-2">
						<Button
							isIconOnly
							startContent={removeItem.isLoading ? undefined : <Trash2 size={16} />}
							isLoading={removeItem.isLoading}
							size="sm"
							color="danger"
							variant="flat"
							onPress={() => removeItem.mutate({ MaCartItem: item.MaCartItem, data: { type: "delete" } })}
						/>

						<span>Số lượng: {item.Quantity}</span>
					</div>
				</section>

				<section>
					<Select
						size="sm"
						items={[...InsuranceTypeOptions, { price: 0, type: "None", description: "Không có" }]}
						defaultSelectedKeys={[item.InsuranceType]}
						onChange={(e) =>
							removeItem.mutate({
								MaCartItem: item.MaCartItem,
								data: {
									type: "update",
									insuranceType: e.target.value as (typeof InsuranceTypeOptions)[number]["type"],
								},
							})
						}
					>
						{(item) => (
							<SelectItem key={item.type} description={item.description.split(": ")[1]}>
								{item.description.split(": ")[0]}
							</SelectItem>
						)}
					</Select>
				</section>
			</CardBody>
		</Card>
	);
};
