"use client";

import { Spinner } from "@nextui-org/react";

export default function Loading() {
	return (
		<div className="flex h-full w-full flex-1 items-center justify-center">
			<Spinner label="Loading..." color="primary" />
		</div>
	);
}
