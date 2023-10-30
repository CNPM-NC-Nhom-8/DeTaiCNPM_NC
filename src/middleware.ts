import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
	publicRoutes: [
		"/",
		"/auth/login",
		"/auth/register",
		"/cart",
		"/phone/:path*",
		"/api/trpc/:path*",
		"/api/clerk/:path*",
		"/api/test",
	],
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
