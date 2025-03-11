"use client";

import { useTheme } from "next-themes";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
	const { theme } = useTheme();

	return (
		<div className="container mx-auto flex flex-1 items-center justify-center py-4">
			<SignUp appearance={{ baseTheme: theme === "dark" ? dark : undefined }} />
		</div>
	);
}
