import { nextui } from "@nextui-org/react";

import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			keyframes: {
				loading: {
					from: { transform: "rotate(0deg)" },
					to: { transform: "rotate(-360deg)" },
				},
			},
		},
		container: {
			center: true,
			padding: "1.5rem",
			screens: { "2xl": "1400px" },
		},
	},
	darkMode: "class",
	plugins: [nextui()],
};
export default config;
