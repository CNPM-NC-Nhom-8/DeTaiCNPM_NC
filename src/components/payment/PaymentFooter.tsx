"use client";

import { moneyFormat } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterInputs, RouterOutputs } from "@/utils/trpc/react";

import { InsuranceTypeOptions } from "../phone/data";

import { useRouter } from "next/navigation";

import { Button, Card, CardBody, Select, SelectItem } from "@nextui-org/react";

import { useState } from "react";
import toast from "react-hot-toast";

export const PaymentFooter = ({ cart }: { cart: RouterOutputs["cart"]["getCartItems"] }) => {
	const router = useRouter();
	const apiUtils = api.useUtils();

	const [paymentMethod, setMethod] = useState<RouterInputs["cart"]["payment"]["paymentMethod"]>("None");

	const payment = api.cart.payment.useMutation({
		onSuccess: async (data) => {
			router.push("/payment/success/" + data?.data.MaDonHang);
			await apiUtils.cart.getCartItems.refetch();
		},
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardBody className="flex flex-row items-center justify-between">
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
				</CardBody>
			</Card>

			<Card>
				<CardBody className="flex flex-row items-center justify-between">
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
							onPress={() =>
								payment.mutate({ maCartItems: cart.map((item) => item.MaCartItem), paymentMethod })
							}
							color="success"
							isLoading={payment.isPending}
						>
							Thanh toán ngay ({cart.length})
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};
