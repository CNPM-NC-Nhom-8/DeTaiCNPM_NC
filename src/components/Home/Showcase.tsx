"use client";

import { cn } from "@/utils/common";

import { Button, Image, Spacer } from "@nextui-org/react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const images: { src: string; key: string; name: string }[] = [
	{
		key: "Z FLIP5|FOLD5",
		name: "Mở bán giá sốc",
		src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:80/plain/https://dashboard.cellphones.com.vn/storage/sliding-fold-th9-ver1.png",
	},
	{
		key: "XIAOMI 13T SERIES",
		name: "Đặt trước quà ngon",
		src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:80/plain/https://dashboard.cellphones.com.vn/storage/xiaomi-13t-sliding-0004-giamngay.jpg",
	},
	{
		key: "SMART TV LG 4K",
		name: "Giải trí thả ga",
		src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:80/plain/https://dashboard.cellphones.com.vn/storage/tivi-LG-thang10-65inch-sliding.jpg",
	},
	{
		key: "XIAOMI MI BAND 8",
		name: "Giá rẻ chốt ngay",
		src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:80/plain/https://dashboard.cellphones.com.vn/storage/xiaomiband8.jpg",
	},
	{
		key: "GHẾ E-DRA",
		name: "Mở bán giá rẻ",
		src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:80/plain/https://dashboard.cellphones.com.vn/storage/690-300-ghe-cth-e-dra-sliding.jpg",
	},
];

const vouncher = [
	{
		key: "vouncher1",
		src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/m14-right-homepage-th9.png",
	},
	{
		key: "vouncher2",
		src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/ipad-102-th9-001231.png",
	},
	{
		key: "vouncher3",
		src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/asus%20vivobook%20oled.jpg",
	},
];

export const Showcase = () => {
	const [currentTab, setTab] = useState<(typeof images)[number]>(images[0]!);

	return (
		<section className="flex h-max rounded-lg">
			<div className="flex flex-col overflow-hidden rounded-lg">
				<div className="group relative w-full">
					<Button
						isIconOnly
						startContent={<ChevronLeft />}
						className="absolute left-0 top-1/2 z-10 -translate-x-full rounded-l-none bg-black/60 transition-transform group-hover:translate-x-0"
						onClick={() => {
							setTab((prev) => {
								const currentIndex = images.indexOf(prev);
								return images.at(currentIndex - 1 < 0 ? -1 : currentIndex - 1)!;
							});
						}}
					/>

					<div
						className="flex w-full transition-all"
						style={{ translate: -Math.abs(images.indexOf(currentTab)) + "00%" }}
					>
						{images.map((item) => (
							<div
								key={item.key}
								className="flex min-w-full flex-shrink-0 flex-grow [&>div]:w-full [&>div]:!max-w-full"
							>
								<Image
									src={item.src}
									alt=""
									className="w-full flex-shrink-0 flex-grow rounded-b-none rounded-t-lg"
								/>
							</div>
						))}
					</div>

					<Button
						isIconOnly
						startContent={<ChevronRight />}
						className="absolute right-0 top-1/2 z-10 translate-x-full rounded-r-none bg-black/60 transition-transform group-hover:translate-x-0"
						onClick={() => {
							setTab((prev) => {
								const currentIndex = images.indexOf(prev);
								return images.at(currentIndex + 1 >= images.length ? 0 : currentIndex + 1)!;
							});
						}}
					/>
				</div>

				<div className="flex w-full overflow-x-scroll scrollbar-hide">
					{images.map((item) => (
						<Button
							data-key={item.key.replaceAll(" ", "-")}
							key={item.key}
							radius="none"
							className={cn("h-full min-w-max flex-col py-2 outline-none", {
								"border-b-2 border-black dark:border-white": currentTab.key === item.key,
							})}
							onClick={() => setTab(item)}
						>
							{item.key}
							<span className={cn({ "font-semibold": currentTab.key === item.key })}>{item.name}</span>
						</Button>
					))}
				</div>
			</div>

			<Spacer x={4} />

			<aside className="flex w-1/4 flex-shrink-0 flex-col justify-between ">
				{vouncher.map((item) => {
					return <Image src={item.src} key={item.key} alt="" />;
				})}
			</aside>
		</section>
	);
};
