"use client";

import { moneyFormat } from "@/utils/common";
import type { RouterOutputs } from "@/utils/trpc/react";

import { InsuranceTypeOptions } from "../phone/data";

import Link from "next/link";

import { Button, Card, CardBody } from "@nextui-org/react";

export const CartFooter = ({ cart }: { cart: RouterOutputs["cart"]["getCartItems"] }) => {
	return (
		<Card>
			<CardBody className="flex flex-row items-center justify-between">
				<div className="text-small">
					<span>Tạm tính là: </span>
					<span>
						{moneyFormat.format(
							cart.reduce(
								(prev, item) =>
									prev +
									item.SanPham.Gia * item.Quantity +
									(InsuranceTypeOptions.find(({ type }) => type === item.InsuranceType)?.price ?? 0),
								0,
							),
						)}
					</span>
				</div>

				<div>
					<Button as={Link} href="/payment" color="success">
						Mua Ngay ({cart.length})
					</Button>
				</div>
			</CardBody>
		</Card>
	);
};
