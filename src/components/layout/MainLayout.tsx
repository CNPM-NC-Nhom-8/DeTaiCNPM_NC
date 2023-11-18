"use client";

import { TRPCReactProvider } from "@/utils/trpc/react";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";

import { NextUIProvider } from "@nextui-org/react";

export function MainLayout({ children, headers }: { children: React.ReactNode; headers: Headers }) {
	const router = useRouter();

	return (
		// eslint-disable-next-line @typescript-eslint/unbound-method
		<NextUIProvider navigate={router.push} className="flex min-h-screen max-w-[100vw] flex-col">
			<NextThemesProvider attribute="class" defaultTheme="dark">
				<TRPCReactProvider headers={headers}>{children}</TRPCReactProvider>
			</NextThemesProvider>
		</NextUIProvider>
	);
}
