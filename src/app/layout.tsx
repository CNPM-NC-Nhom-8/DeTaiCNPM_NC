import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider, auth } from "@clerk/nextjs";
import { viVN } from "@clerk/localizations";

import { Toaster } from "react-hot-toast";

import { MainLayout } from "@/components/layout/mainLayout";
import { MainNavbar } from "@/components/layout/mainNavbar";
import { BottomFooter } from "@/components/layout/BottomFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		template: "%s - CellPhoneX",
		default: "CellPhoneX - Nơi bán điện thoại chính hãng giá tốt nhất",
	},
	description:
		"CellPhoneX - Nơi bán điện thoại chính hãng Apple, Samsung, Oppo, Xiaomi giá rẻ nhất thị trường. Giao hàng nhanh trong 24h. Bảo hành 12 tháng chính hãng.",
	viewport: { initialScale: 1, maximumScale: 1 },
	authors: { name: "Asakuri", url: "https://github.com/Noki-Asakuri" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider localization={viVN}>
			<html lang="en">
				<body className={inter.className}>
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
				</body>
			</html>
		</ClerkProvider>
	);
}
