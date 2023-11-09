"use client";

import { moneyFormat } from "@/utils/common";
import type { RouterOutputs } from "@/utils/trpc/shared";

import { Button, Card, CardBody } from "@nextui-org/react";
import Link from "next/link";

export const CartFooter = ({ cart }: { cart: RouterOutputs["cart"]["getCartItems"] }) => {
	return (
		<Card>
			<CardBody className="flex flex-row items-center justify-between">
				<div className="text-small">
					<span>Tạm tính là: </span>
					<span>{moneyFormat.format(cart.reduce((prev, item) => prev + item.SanPham.Gia, 0))}</span>
				</div>

				<div>
					<Button as={Link} href="/payment" color="success">Mua Ngay ({cart.length})</Button>
				</div>
			</CardBody>
		</Card>
	);
};
