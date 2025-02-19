import createJiti from "jiti";
import { fileURLToPath } from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./src/env");

/** @type {import("next").NextConfig} */
const options = {
	typescript: { ignoreBuildErrors: true },
	eslint: { ignoreDuringBuilds: true },
	logging: { fetches: { fullUrl: true } },
	experimental: {
		ppr: true,
		authInterrupts: true,
		useCache: true,
		reactCompiler: true,
	},
};

export default options;
