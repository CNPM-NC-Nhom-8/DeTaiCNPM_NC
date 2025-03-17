"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { moneyFormat } from "@/utils/common";
import type { RouterOutputs } from "@/utils/trpc/react";
import { api } from "@/utils/trpc/react";

import { InsuranceTypeOptions } from "../phone/data";

import Image from "next/image";
import Link from "next/link";

import type { Insurance } from "@prisma/client";

import { LoaderIcon, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function CartItem({ item, index }: { item: RouterOutputs["cart"]["getCartItems"][number]; index: number }) {
	const apiUtils = api.useUtils();
	const insuranceType = InsuranceTypeOptions.find(({ type }) => type === item.InsuranceType);

	const updateCartItem = api.cart.updateCartItem.useMutation({
		onError: ({ message }) => toast.error("Lỗi: " + message),
		onSuccess: () => void apiUtils.cart.invalidate(),
	});

	if (updateCartItem.variables?.data.type === "delete" && updateCartItem.isSuccess) return null;

	return (
		<Card
			aria-disabled={updateCartItem.isPending}
			className="aira-disabled:pointer-events-none aria-disabled:opacity-50"
			aria-label={`Sản phẩm ${index}`}
			aria-describedby={`Sản phẩm ${index}`}
			aria-live="polite"
			title={`Ngày thêm vào giỏ hàng: ${item.addedAt.toLocaleString()}`}
		>
			<CardContent className="flex p-3">
				<Link className="flex w-2/3 gap-4" href={"/phone/" + encodeURIComponent(item.SanPham.SanPhamMau.TenSP)}>
					<Image
						width={128}
						height={128}
						unoptimized
						src={item.SanPham.SanPhamMau.AnhBia}
						alt={item.SanPham.SanPhamMau.TenSP}
						className="w-32 rounded object-cover object-center"
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
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray">#{index}</span>

						<Button
							size="icon"
							variant="destructive"
							disabled={updateCartItem.isPending}
							onMouseDown={() =>
								updateCartItem.mutate({ MaCartItem: item.MaCartItem, data: { type: "delete" } })
							}
						>
							{updateCartItem.isPending ? (
								<LoaderIcon size={16} className="animate-spin" />
							) : (
								<Trash2 size={16} />
							)}
						</Button>
					</div>

					<div className="flex items-center">
						<Button
							size="icon"
							variant="outline"
							className="rounded-r-none border-r-0"
							onMouseDown={() =>
								updateCartItem.mutate({
									MaCartItem: item.MaCartItem,
									data: { type: "quanlity", option: "decrease" },
								})
							}
						>
							<Minus size={16} />
						</Button>

						<Button asChild size="icon" variant="outline" className="rounded-none">
							<span>{item.Quantity}</span>
						</Button>

						<Button
							size="icon"
							variant="outline"
							className="rounded-l-none border-l-0"
							onMouseDown={() =>
								updateCartItem.mutate({
									MaCartItem: item.MaCartItem,
									data: { type: "quanlity", option: "increase" },
								})
							}
						>
							<Plus size={16} />
						</Button>
					</div>

					<Button variant="outline">Tồn kho: {item.SanPham.MatHang?.TonKho}</Button>
				</div>
			</CardContent>

			<CardFooter className="grid grid-cols-[max-content,1fr] gap-2 p-3 pt-0">
				<Label className="w-max flex-shrink-0" htmlFor="insurance">
					Chọn loại bảo hiểm:
				</Label>

				<Select
					name="insurance"
					disabled={updateCartItem.isPending}
					defaultValue={insuranceType?.type ?? InsuranceTypeOptions[0]!.type}
					onValueChange={(value) =>
						updateCartItem.mutate({
							MaCartItem: item.MaCartItem,
							data: { type: "update", insuranceType: value as keyof typeof Insurance },
						})
					}
				>
					<SelectTrigger className="w-full [&>span]:w-full">
						<SelectValue placeholder="Chọn loại bảo hiểm" />
					</SelectTrigger>

					<SelectContent className="w-full">
						{InsuranceTypeOptions.map((item) => (
							<SelectItem key={item.type} value={item.type} className="[&>span:nth-child(2)]:w-full">
								<span className="flex w-full justify-between gap-4 pr-4">
									<span className="line-clamp-1 text-left">{item.title}</span>
									<span>{moneyFormat.format(item.price)}</span>
								</span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<div className="col-span-2 flex w-full items-center justify-between gap-2 text-sm">
					<span>
						Bảo hiểm: {insuranceType?.title ?? "Không có"} ({moneyFormat.format(insuranceType?.price ?? 0)})
					</span>

					<span>
						Tổng tiền: {moneyFormat.format(item.SanPham.Gia * item.Quantity + (insuranceType?.price ?? 0))}
					</span>
				</div>
			</CardFooter>
		</Card>
	);
}
