"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";

import React, { useState } from "react";
import superjson from "superjson";

import { getBaseUrl } from "@/utils/getBaseUrl";
import { trpc } from "./client";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient({}));
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({ url: getBaseUrl() + "/api/trpc" }),
				loggerLink({
					enabled: (opts) =>
						(process.env.NODE_ENV === "development" && typeof window !== "undefined") ||
						(opts.direction === "down" && opts.result instanceof Error),
				}),
			],
			transformer: superjson,
		}),
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
}
