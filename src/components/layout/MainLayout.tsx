"use client";

import { env } from "@/env.mjs";
import { TRPCReactProvider } from "@/utils/trpc/react";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { NextUIProvider } from "@nextui-org/react";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

if (typeof window !== "undefined") {
	posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: "https://app.posthog.com",
	});
}

export function PostHogPageview(): JSX.Element {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (pathname) {
			let url = window.origin + pathname;
			if (searchParams?.toString()) {
				url = url + `?${searchParams.toString()}`;
			}
			posthog.capture("$pageview", {
				$current_url: url,
			});
		}
	}, [pathname, searchParams]);

	return <></>;
}

export function MainLayout({ children, headers }: { children: React.ReactNode; headers: Headers }) {
	const router = useRouter();

	return (
		// eslint-disable-next-line @typescript-eslint/unbound-method
		<NextUIProvider navigate={router.push} className="flex min-h-screen max-w-[100vw] flex-col">
			<NextThemesProvider attribute="class" defaultTheme="dark">
				<TRPCReactProvider headers={headers}>
					<PostHogProvider client={posthog}>{children}</PostHogProvider>
				</TRPCReactProvider>
			</NextThemesProvider>
		</NextUIProvider>
	);
}
