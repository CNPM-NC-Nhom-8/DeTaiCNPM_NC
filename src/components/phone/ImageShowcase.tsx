"use client";

import type { RouterOutputs } from "@/utils/trpc/react";

import { Button } from "../ui/button";

import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type PropsParams = { images: RouterOutputs["product"]["getSanPham"]["HinhAnh"] };

export function PhoneImageShowcase({ images }: PropsParams) {
	const [currentImage, setImage] = useState(images.at(0)!);

	return (
		<section className="flex flex-col overflow-hidden rounded-lg">
			<div className="group relative w-full">
				<Button
					size="icon"
					variant="outline"
					className="absolute left-0 top-1/2 z-10 -translate-x-full rounded-l-none border-l-0 bg-black/60 group-hover:translate-x-0"
					onMouseDown={() => {
						setImage((prev) => {
							const currentIndex = images.indexOf(prev);
							return images.at(currentIndex - 1 < 0 ? -1 : currentIndex - 1)!;
						});
					}}
				>
					<ChevronLeft />
				</Button>

				<div
					className="flex w-full transition-[translate]"
					style={{ translate: -Math.abs(images.indexOf(currentImage)) + "00%" }}
				>
					{images.map((item) => (
						<div className="relative flex aspect-video min-w-full flex-shrink-0 flex-grow" key={item.MaHA}>
							<Image
								unoptimized
								fill
								src={item.Url}
								alt="Hình ảnh sản phẩm"
								className="object-scale-down object-center"
								// classNames={{
								// 	wrapper: "flex min-w-full flex-shrink-0 flex-grow",
								// 	img: "aspect-video w-full flex-shrink-0 flex-grow rounded-b-none rounded-t-lg object-scale-down object-center",
								// }}
							/>
						</div>
					))}
				</div>

				<Button
					size="icon"
					variant="outline"
					className="absolute right-0 top-1/2 z-10 translate-x-full rounded-r-none border-r-0 bg-black/60 group-hover:translate-x-0"
					onMouseDown={() => {
						setImage((prev) => {
							const currentIndex = images.indexOf(prev);
							return images.at(currentIndex + 1 >= images.length ? 0 : currentIndex + 1)!;
						});
					}}
				>
					<ChevronRight />
				</Button>
			</div>

			<div className="flex w-full gap-2 overflow-x-scroll">
				{images.map((item) => (
					<Button
						variant="ghost"
						key={item.MaHA}
						className="flex h-16 w-16 items-center justify-center rounded-none p-0 outline-none"
						onMouseDown={() => setImage(item)}
					>
						<Image
							unoptimized
							src={item.Url}
							alt=""
							className="aspect-square object-scale-down object-center"
							width={64}
							height={64}
						/>
					</Button>
				))}
			</div>
		</section>
	);
}
