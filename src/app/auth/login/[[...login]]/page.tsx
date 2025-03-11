"use client";

import { useTheme } from "next-themes";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInPage() {
	const { theme } = useTheme();

	return (
		<div className="container mx-auto flex flex-1 items-center justify-center py-4">
			<SignIn appearance={{ baseTheme: theme === "dark" ? dark : undefined }} />
		</div>
	);
}
