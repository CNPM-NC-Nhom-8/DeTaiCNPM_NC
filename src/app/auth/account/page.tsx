"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { useTheme } from "next-themes";

export default function Page() {
	const { theme } = useTheme();

	return (
		<div className="container mx-auto flex max-w-6xl items-center justify-center py-4">
			<UserProfile appearance={{ baseTheme: theme === "dark" ? dark : undefined }} />
		</div>
	);
}
