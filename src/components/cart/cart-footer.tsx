import { cn } from "@/utils/common";
import { moneyFormat } from "@/utils/common";
import type { RouterOutputs } from "@/utils/trpc/react";

import { InsuranceTypeOptions } from "../phone/data";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

import Link from "next/link";

export function CartFooter({ cart }: { cart: RouterOutputs["cart"]["getCartItems"] }) {
	const cost = cart.reduce(
		(prev, item) =>
			prev +
			item.SanPham.Gia * item.Quantity +
			(InsuranceTypeOptions.find(({ type }) => type === item.InsuranceType)?.price ?? 0),
		0,
	);

	return (
		<Card className="w-full border border-[#222225] bg-[#18181b]">
			<CardContent className="flex items-center justify-between gap-2 px-4 py-2">
				<div className="flex h-9 items-center justify-center gap-2 text-small">
					<span>Tạm tính là: </span>
					<span>{moneyFormat.format(cost)}</span>
				</div>

				<Button
					asChild
					className={cn("bg-success-400 text-success-foreground hover:bg-success-500", {
						hidden: cart.length === 0,
					})}
					disabled={cart.length === 0}
				>
					<Link href="/payment">Mua Ngay ({cart.length})</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
