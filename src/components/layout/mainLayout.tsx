"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "jotai";
import { TRPCProvider } from "@/utils/trpc/Provider";

export function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<Provider>
			<NextUIProvider className="flex min-h-screen max-w-[100vw] flex-col">
				<NextThemesProvider attribute="class" defaultTheme="dark">
					<TRPCProvider>{children}</TRPCProvider>
				</NextThemesProvider>
			</NextUIProvider>
		</Provider>
	);
}
