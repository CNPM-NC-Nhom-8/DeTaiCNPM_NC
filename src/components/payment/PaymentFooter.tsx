"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { moneyFormat } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterInputs, RouterOutputs } from "@/utils/trpc/react";

import { InsuranceTypeOptions } from "../phone/data";

import { useRouter } from "next/navigation";

import { Select, SelectItem } from "@nextui-org/react";

import { useState } from "react";
import { toast } from "sonner";

type PayingMethod = RouterInputs["cart"]["payment"]["payingData"]["method"];

type PaymentFooterProps = {
	cart: RouterOutputs["cart"]["getCartItems"];
	defaultAddress?: string | null;
};

export const PaymentFooter = ({ cart, defaultAddress }: PaymentFooterProps) => {
	const router = useRouter();

	const [paymentMethod, setMethod] = useState<PayingMethod>("None");
	const [address, setAddress] = useState(defaultAddress ?? "");
	const [creditCard, setCreditCard] = useState("");

	const payment = api.cart.payment.useMutation({
		onSuccess: async (data) => {
			router.refresh();
			router.push("/payment/success/" + data?.data.MaDonHang);
		},
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardContent className="flex flex-col gap-2 p-3">
					<Select
						label="Phương thức thanh toán"
						labelPlacement="outside"
						disallowEmptySelection
						disabledKeys={["None"]}
						isRequired
						size="sm"
						items={[
							{ id: "Cash", value: "Tiền mặt", description: "Thanh toán bằng tiền mặt khi nhận hàng" },
							{
								id: "Bank",
								value: "Chuyển khoản",
								description: "Thanh toán thông qua chuyển khoản ngân hàng",
							},
							{ id: "None", value: "Chưa chọn" },
						]}
						defaultSelectedKeys={["None"]}
						onChange={(event) => setMethod(event.target.value as typeof paymentMethod)}
					>
						{(item) => (
							<SelectItem key={item.id} description={item.description}>
								{item.value}
							</SelectItem>
						)}
					</Select>

					<div className="flex flex-col gap-1">
						<Label className="text-xs" htmlFor="address">
							Địa chỉ nhận hàng <span className="text-red-500">*</span>
						</Label>
						<Input
							required={!defaultAddress || defaultAddress.length < 10}
							id="address"
							placeholder="Địa chỉ nhận hàng"
							value={address}
							onChange={(event) => setAddress(event.target.value)}
						/>
					</div>

					{paymentMethod === "Bank" && (
						<div className="flex flex-col gap-1">
							<Label className="text-xs" htmlFor="creditCard">
								Số thẻ tín dụng <span className="text-red-500">*</span>
							</Label>
							<Input
								required
								id="creditCard"
								placeholder="Số thẻ tín dụng"
								value={creditCard}
								onChange={(event) => setCreditCard(event.target.value)}
							/>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardContent className="flex items-center justify-between p-3">
					<div className="text-small">
						<span>Tổng tiền: </span>
						<span>
							{moneyFormat.format(
								cart.reduce(
									(prev, item) =>
										prev +
										item.SanPham.Gia * item.Quantity +
										(InsuranceTypeOptions.find(({ type }) => type === item.InsuranceType)?.price ??
											0),
									0,
								),
							)}
						</span>
					</div>

					<div>
						<Button
							variant="secondary"
							disabled={payment.isPending || paymentMethod === "None"}
							onMouseDown={() =>
								payment.mutate({
									maCartItems: cart.map((item) => item.MaCartItem),
									payingData: { method: paymentMethod, address, creditCard },
								})
							}
						>
							Thanh toán ngay ({cart.length})
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
