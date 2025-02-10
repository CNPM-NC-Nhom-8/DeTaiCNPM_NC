"use client";

import { moneyFormat } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/react";

import { InsuranceTypeOptions } from "../phone/data";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, ButtonGroup, Card, CardBody, Image, Select, SelectItem } from "@nextui-org/react";

import { Minus, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export const CartItem = ({ item }: { item: RouterOutputs["cart"]["getCartItems"][number] }) => {
	const insuranceType = InsuranceTypeOptions.find(({ type }) => type === item.InsuranceType);

	const router = useRouter();
	const apiUtils = api.useUtils();

	const updateitems = api.cart.updateCartItem.useMutation({
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

							<div className="text-danger">
								<span>{moneyFormat.format(item.SanPham.Gia * item.Quantity)}</span>

								{insuranceType && insuranceType.type !== "None" && (
									<span className="text-small"> + {moneyFormat.format(insuranceType.price)}</span>
								)}
							</div>
						</div>
					</Link>

					<div className="relative flex flex-grow flex-col items-end gap-2">
						<Button
							isIconOnly
							startContent={updateitems.isPending ? undefined : <Trash2 size={16} />}
							isLoading={updateitems.isPending}
							size="sm"
							color="danger"
							variant="flat"
							onPress={() =>
								updateitems.mutate({ MaCartItem: item.MaCartItem, data: { type: "delete" } })
							}
						/>

						<ButtonGroup>
							<Button
								size="sm"
								isIconOnly
								onPress={() =>
									updateitems.mutate({
										MaCartItem: item.MaCartItem,
										data: { type: "quanlity", option: "decrease" },
									})
								}
							>
								<Minus size={16} />
							</Button>
							<Button size="sm" isIconOnly disableAnimation>
								{item.Quantity}
							</Button>
							<Button
								size="sm"
								isIconOnly
								onPress={() =>
									updateitems.mutate({
										MaCartItem: item.MaCartItem,
										data: { type: "quanlity", option: "increase" },
									})
								}
							>
								<Plus size={16} />
							</Button>
						</ButtonGroup>
						<Button size="sm">Tồn kho: {item.SanPham.MatHang?.TonKho}</Button>
					</div>
				</section>

				<section>
					<Select
						size="sm"
						disallowEmptySelection
						items={[...InsuranceTypeOptions, { price: 0, type: "None", description: "Không có" }]}
						defaultSelectedKeys={[item.InsuranceType]}
						onChange={(e) => {
							updateitems.mutate({
								MaCartItem: item.MaCartItem,
								data: {
									type: "update",
									insuranceType: e.target.value as (typeof InsuranceTypeOptions)[number]["type"],
								},
							});
						}}
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
