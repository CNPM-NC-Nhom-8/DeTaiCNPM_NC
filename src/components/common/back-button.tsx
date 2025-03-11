"use client";

import { Button } from "../ui/button";

import { useRouter } from "next/navigation";

import { ChevronLeft } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

export function BackButton(props: ComponentPropsWithoutRef<typeof Button>) {
	const router = useRouter();

	return (
		<Button size="icon" variant="outline" {...props} onMouseDown={() => router.back()} aria-label="Back">
			<ChevronLeft />
		</Button>
	);
}
