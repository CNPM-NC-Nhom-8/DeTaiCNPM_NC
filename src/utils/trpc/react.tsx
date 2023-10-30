"use client";

import { type AppRouter } from "@/server/trpc/routers";

import { getUrl, transformer } from "./shared";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

import { useState } from "react";

export const trpc = createTRPCReact<AppRouter>({ abortOnUnmount: true });

export function TRPCReactProvider(props: { children: React.ReactNode; headers: Headers }) {
	const [queryClient] = useState(() => new QueryClient());

	const [trpcClient] = useState(() =>
		trpc.createClient({
			transformer,
			links: [
				loggerLink({
					enabled: (op) =>
						process.env.NODE_ENV === "development" ||
						(op.direction === "down" && op.result instanceof Error),
				}),
				unstable_httpBatchStreamLink({
					url: getUrl(),
					headers() {
						const heads = new Map(props.headers);
						heads.set("x-trpc-source", "react");
						return Object.fromEntries(heads);
					},
				}),
			],
		}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<trpc.Provider client={trpcClient} queryClient={queryClient}>
				{props.children}
			</trpc.Provider>
		</QueryClientProvider>
	);
}
