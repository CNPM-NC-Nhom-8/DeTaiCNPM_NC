import { env } from "@/env.mjs";
import { createTRPCContext } from "@/server/trpc/context";
import { appRouter } from "@/server/trpc/routers";

import { type NextRequest } from "next/server";

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: NextRequest) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => createTRPCContext({ req }),
		onError:
			env.NODE_ENV === "development"
				? ({ path, error }) => {
						console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
				  }
				: undefined,
	});

export { handler as GET, handler as POST };
