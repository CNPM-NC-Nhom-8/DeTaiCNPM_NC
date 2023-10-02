"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "jotai";

export function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<Provider>
			<NextUIProvider className="flex min-h-screen max-w-[100vw] flex-col">
				<NextThemesProvider attribute="class" defaultTheme="dark">
					{children}
				</NextThemesProvider>
			</NextUIProvider>
		</Provider>
	);
}
