"use client";

import { useRouter } from "next/navigation";

import { Button } from "@nextui-org/react";

import { ChevronLeft } from "lucide-react";

export const HistoryPaymentDetailsNav = () => {
	const router = useRouter();

	return (
		<nav className="flex w-full items-center justify-between">
			<Button variant="light" isIconOnly startContent={<ChevronLeft />} onPress={() => router.back()} />
			<h3 className="justify-center text-2xl font-semibold">Chi tiết đơn hàng</h3>
			<span></span>
		</nav>
	);
};
