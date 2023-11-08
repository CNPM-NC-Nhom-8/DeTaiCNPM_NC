import { env } from "@/env.mjs";

import { PostHog } from "posthog-node";

export const postHogClient = new PostHog(env.POSTHOG_KEY, { host: "https://app.posthog.com" });
