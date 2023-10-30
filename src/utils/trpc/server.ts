import { type AppRouter } from "@/server/trpc/routers";

import { getUrl, transformer } from "./shared";

import { headers } from "next/headers";

import { createTRPCProxyClient, loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";

export const trpc = createTRPCProxyClient<AppRouter>({
	transformer,
	links: [
		loggerLink({
			enabled: (op) =>
				process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
		}),
		unstable_httpBatchStreamLink({
			url: getUrl(),
			headers() {
				const heads = new Map(headers());
				heads.set("x-trpc-source", "rsc");
				return Object.fromEntries(heads);
			},
		}),
	],
});
