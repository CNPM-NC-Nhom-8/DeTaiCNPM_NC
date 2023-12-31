// app/posthog.js
import { env } from "@/env.mjs";

import { PostHog } from "posthog-node";

export default function PostHogClient() {
	const posthogClient = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
		host: "https://app.posthog.com",
		flushAt: 1,
		flushInterval: 0,
	});
	return posthogClient;
}
