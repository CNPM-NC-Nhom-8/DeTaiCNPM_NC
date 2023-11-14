"use client"

import { Button } from "@nextui-org/react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const ProductNav = () => {
    const router = useRouter();

    return (
        <nav className="flex w-full items-center justify-between">
			<Button variant="light" isIconOnly startContent={<ChevronLeft />} onClick={() => router.back()} />
			<span></span>
		</nav>
    );
}