"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { moneyFormat } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterInputs, RouterOutputs } from "@/utils/trpc/react";

import { InsuranceTypeOptions } from "../phone/data";

import { useRouter } from "next/navigation";

import { Select, SelectItem } from "@nextui-org/react";

import { useState } from "react";
import { toast } from "sonner";

export const PaymentFooter = ({ cart }: { cart: RouterOutputs["cart"]["getCartItems"] }) => {
	const router = useRouter();
	const [paymentMethod, setMethod] = useState<RouterInputs["cart"]["payment"]["paymentMethod"]>("None");

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
				<CardContent className="flex p-3">
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
								payment.mutate({ maCartItems: cart.map((item) => item.MaCartItem), paymentMethod })
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
