"use client";

import { RouterOutput } from "@/server/trpc/trpc";

import { Button, Image } from "@nextui-org/react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type PropsParams = { images: RouterOutput["sanPham"]["getSanPham"]["HinhAnh"] };

export const PhoneImageShowcase = ({ images }: PropsParams) => {
	const [currentImage, setImage] = useState(images[0]);

	return (
		<section className="flex flex-col overflow-hidden rounded-lg">
			<div className="group relative w-full">
				<Button
					isIconOnly
					startContent={<ChevronLeft />}
					className="absolute left-0 top-1/2 z-10 -translate-x-full rounded-l-none bg-black/60 transition-transform group-hover:translate-x-0"
					onClick={() => {
						setImage((prev) => {
							const currentIndex = images.indexOf(prev);
							return images.at(currentIndex - 1 < 0 ? -1 : currentIndex - 1)!;
						});
					}}
				/>

				<div
					className="flex w-full transition-all"
					style={{ translate: -Math.abs(images.indexOf(currentImage)) + "00%" }}
				>
					{images.map((item) => (
						<div
							key={item.MaHA}
							className="flex min-w-full flex-shrink-0 flex-grow [&>div]:w-full [&>div]:!max-w-full"
						>
							<Image
								src={item.Url}
								alt=""
								className="aspect-video w-full flex-shrink-0 flex-grow rounded-b-none rounded-t-lg object-scale-down object-center"
							/>
						</div>
					))}
				</div>

				<Button
					isIconOnly
					startContent={<ChevronRight />}
					className="absolute right-0 top-1/2 z-10 translate-x-full rounded-r-none bg-black/60 transition-transform group-hover:translate-x-0"
					onClick={() => {
						setImage((prev) => {
							const currentIndex = images.indexOf(prev);
							return images.at(currentIndex + 1 >= images.length ? 0 : currentIndex + 1)!;
						});
					}}
				/>
			</div>

			<div className="flex w-full gap-4 overflow-x-scroll px-2 scrollbar-hide">
				{images.map((item) => (
					<Button
						key={item.MaHA}
						radius="none"
						className="h-full min-w-max flex-col p-0 outline-none"
						onClick={() => setImage(item)}
					>
						<Image radius="none" src={item.Url} alt="" className="aspect-square w-12 object-cover" />
					</Button>
				))}
			</div>
		</section>
	);
};