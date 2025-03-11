import { QueryCache, QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query";

import { toast } from "sonner";
import SuperJSON from "superjson";

export const createQueryClient = () =>
	new QueryClient({
		queryCache: new QueryCache({
			onError(error, query) {
				console.error("An error occurred in a query", query, error);
				toast.error("Lỗi: " + error.message);
			},
		}),
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 30 * 1000,
			},
			dehydrate: {
				serializeData: SuperJSON.serialize,
				shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending",
			},
			hydrate: {
				deserializeData: SuperJSON.deserialize,
			},
		},
	});
