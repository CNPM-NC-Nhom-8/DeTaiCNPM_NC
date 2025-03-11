import { BottomFooter } from "@/components/layout/bottom-footer";
import { Providers } from "@/components/layout/providers";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Toaster } from "@/components/ui/sonner";

import "@/styles/globals.css";
import { cn } from "@/utils/common";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { viVN } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		template: "%s - CellPhoneX",
		default: "CellPhoneX - Nơi bán điện thoại chính hãng giá tốt nhất",
	},
	description:
		"CellPhoneX - Nơi bán điện thoại chính hãng Apple, Samsung, Oppo, Xiaomi giá rẻ nhất thị trường. Giao hàng nhanh trong 24h. Bảo hành 12 tháng chính hãng.",
	authors: { name: "Asakuri", url: "https://github.com/Noki-Asakuri" },
};

export const viewport: Viewport = {
	themeColor: "dark",
	colorScheme: "dark light",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider localization={viVN}>
			<html lang="en" suppressHydrationWarning>
				<body className={cn(inter.className, "antialiased")}>
					<Suspense>
						<Providers>
							<TopNavbar />
							{children}
							<BottomFooter />
						</Providers>
					</Suspense>

					<Toaster />
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	);
}
