"use client";

import { Button } from "@/components/ui/button";

import type { Metadata } from "next";
import Link from "next/link";

import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
	title: "Lỗi 404 - Trang không tồn tại",
};

export default function NotFoundPage() {
	return (
		<div className="container mx-auto flex max-w-5xl flex-1 items-center justify-center">
			<div className="flex w-max flex-col items-center gap-2 px-2 py-4">
				<h1 className="flex items-center justify-center gap-2 text-5xl font-bold text-red-500">
					<AlertTriangle size={48} strokeWidth={1.5} /> Lỗi 404 <AlertTriangle size={48} strokeWidth={1.5} />
				</h1>

				<h2 className="text-2xl font-semibold text-red-500">Trang không tồn tại</h2>

				<p className="text-center text-lg">
					Trang mà bạn đang tìm không tồn tại. <br /> Vui lòng quay lại trang chính hoặc liên hệ chúng tôi nếu
					bạn nghĩ đây là 1 lỗi kỹ thuật!
				</p>

				<div className="flex w-full max-w-xs items-center justify-between">
					<Button asChild className="rounded-r-none" variant="outline">
						<Link href="/">Quay lại trang chủ!</Link>
					</Button>

					<Button asChild className="rounded-l-none" variant="outline">
						<Link href="#">Liên hệ kỹ thuật viên</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
