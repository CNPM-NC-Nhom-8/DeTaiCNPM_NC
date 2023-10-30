"use client";

import { useTheme } from "next-themes";

import { UserProfile, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Spinner } from "@nextui-org/react";

export default function Page() {
	const { theme } = useTheme();
	const { isLoaded } = useUser();

	return (
		<div className="container flex max-w-6xl flex-grow items-center justify-center py-4">
			{isLoaded ? (
				<UserProfile appearance={{ baseTheme: theme === "dark" ? dark : undefined }} />
			) : (
				<Spinner label="Loading..." />
			)}
		</div>
	);
}
