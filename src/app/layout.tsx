import { BottomFooter } from "@/components/layout/BottomFooter";
import { MainLayout } from "@/components/layout/MainLayout";
import { MainNavbar } from "@/components/layout/MainNavbar";
import { cn } from "@/utils/common";

import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { viVN } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic",
	fetchCache = "default-no-store";

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
					<MainLayout>
						<MainNavbar />
						{children}
						<BottomFooter />
					</MainLayout>

					<Toaster
						toastOptions={{
							position: "top-right",
							style: { borderRadius: "12px", background: "#333", color: "#fff" },
						}}
					/>

					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	);
}
