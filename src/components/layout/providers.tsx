"use client";

import { TRPCReactProvider } from "@/utils/trpc/react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { NextUIProvider } from "@nextui-org/react";

import { NuqsAdapter } from "nuqs/adapters/next/app";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NuqsAdapter>
			<NextUIProvider className="flex min-h-svh max-w-[100vw] flex-col">
				<NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					<TRPCReactProvider>{children}</TRPCReactProvider>
				</NextThemesProvider>
			</NextUIProvider>
		</NuqsAdapter>
	);
}
