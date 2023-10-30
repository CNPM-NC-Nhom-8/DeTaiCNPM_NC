"use client";

import { useTheme } from "next-themes";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
	const { theme } = useTheme();

	return (
		<div className="container mx-auto max-w-6xl">
			<UserProfile appearance={{ baseTheme: theme === "dark" ? dark : undefined }} />
		</div>
	);
}
