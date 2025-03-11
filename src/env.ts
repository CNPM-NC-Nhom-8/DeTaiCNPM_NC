import { createEnv } from "@t3-oss/env-nextjs";

import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		CLERK_SECRET_KEY: z.string().min(1),
		CLERK_SIGNING_KEY: z.string().min(1),

		NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

		SUPABASE_URL: z.string().url(),
		SUPABASE_KEY: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
		NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().min(1),
		NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().min(1),
	},
	// For Next.js >= 13.4.4, you only need to destructure client variables:
	experimental__runtimeEnv: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
		NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
	},
});
