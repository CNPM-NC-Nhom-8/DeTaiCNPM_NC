import { db } from "@/server/db";

import { Button } from "../ui/button";

import { unstable_cacheTag } from "next/cache";
import Link from "next/link";

import { auth } from "@clerk/nextjs/server";

import { LoaderIcon, ShoppingCart } from "lucide-react";
import { Suspense } from "react";

export async function CartNavbar() {
	const userId = (await auth()).userId;

	return (
		<Button aria-label="Cart" asChild variant="outline">
			<Link href="/cart">
				<Suspense fallback={<LoaderIcon size={20} className="animate-spin" />}>
					<CartData userId={userId} />
				</Suspense>
			</Link>
		</Button>
	);
}

async function getCartData({ userId }: { userId: string | null }) {
	if (!userId) return 0;
	return await db.cartItem.count({ where: { MaKhachHang: userId } });
}

async function CartData({ userId }: { userId: string | null }) {
	const cartData = await getCartData({ userId });

	return (
		<span className="flex items-center justify-center gap-2">
			<ShoppingCart size={20} className="" />
			<span>{cartData}</span>
		</span>
	);
}
