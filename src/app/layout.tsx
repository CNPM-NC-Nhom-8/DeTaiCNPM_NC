import "./globals.css";
import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { Toaster } from "react-hot-toast";

import { MainLayout } from "@/components/layout/mainLayout";
import { MainNavbar } from "@/components/layout/mainNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "CellPhoneX - Nơi bán điện thoại chính hãng giá tốt nhất",
	description:
		"CellPhoneX - Nơi bán điện thoại chính hãng Apple, Samsung, Oppo, Xiaomi giá rẻ nhất thị trường. Giao hàng nhanh trong 24h. Bảo hành 12 tháng chính hãng.",
	viewport: { initialScale: 1, maximumScale: 1 },
	authors: { name: "Asakuri", url: "https://github.com/Noki-Asakuri" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<MainLayout>
						<MainNavbar />
						{children}
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
