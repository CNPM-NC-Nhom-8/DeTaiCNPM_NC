"use client";

import { useRouter } from "next/navigation";

import { Button } from "@nextui-org/react";

import { ChevronLeft } from "lucide-react";

export const PaymentNav = ({ count }: { count: number }) => {
	const router = useRouter();

	return (
		<nav className="flex w-full items-center justify-between">
			<Button variant="light" isIconOnly startContent={<ChevronLeft />} onClick={() => router.back()} />
			<h3 className="justify-center text-2xl font-semibold">Thanh toán ({count})</h3>

			<span></span>
		</nav>
	);
};
