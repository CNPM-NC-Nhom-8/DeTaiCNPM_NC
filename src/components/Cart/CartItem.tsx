"use client";

import type { RouterOutputs } from "@/utils/trpc/shared";

import { Card, CardBody, Image } from "@nextui-org/react";

export const CartItem = ({ cartItem }: { cartItem: RouterOutputs["cart"]["layGioHang"][number] }) => {
	return (
		<Card>
			<CardBody>
				<Image src={cartItem.SanPham.SanPhamMau.AnhBia} className="aspect-square h-32" />
			</CardBody>
		</Card>
	);
};
