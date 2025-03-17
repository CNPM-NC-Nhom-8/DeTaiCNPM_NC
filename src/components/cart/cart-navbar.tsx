"use client";

import { Button } from "@/components/ui/button";

import { api } from "@/utils/trpc/react";

import Link from "next/link";

import { ShoppingCart } from "lucide-react";
import { use } from "react";

export function CartNavbar({ amountPromise }: { amountPromise: Promise<number> }) {
	const query = api.cart.getCartAmount.useQuery(undefined, { initialData: use(amountPromise) });

	return (
		<Button aria-label="Cart" asChild variant="outline">
			<Link href="/cart">
				<span className="flex items-center justify-center gap-2">
					<ShoppingCart size={20} />
					<span>{query.data}</span>
				</span>
			</Link>
		</Button>
	);
}
