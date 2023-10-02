"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col">
			<h2>Not Found</h2>
			<p>Could not find requested resource</p>
			<Button as={Link} href="/" color="primary">
				Return Home
			</Button>
		</div>
	);
}
