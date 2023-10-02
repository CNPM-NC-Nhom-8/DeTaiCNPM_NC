"use client";

import { Button } from "@nextui-org/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";

export const CartNav = ({ cartLength }: { cartLength: number }) => {
	const router = useRouter();

	return (
		<nav className="flex w-full items-center justify-evenly">
			<Button variant="light" isIconOnly startContent={<ChevronLeft />} onClick={() => router.back()} />
			<h3 className="justify-center text-xl font-semibold">Giỏ hàng của bạn ({cartLength})</h3>
			<div></div>
		</nav>
	);
};
