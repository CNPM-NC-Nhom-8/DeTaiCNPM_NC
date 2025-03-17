"use client";

import { cn } from "@/utils/common";

import { Button } from "../ui/button";

import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function Showcase() {
	const showcaseData = useMemo(() => {
		return {
			images: [
				{
					title: "Z FLIP5|FOLD5",
					name: "Mở bán giá sốc",
					src: "http://dummyimage.com/690x300.png/ff4444/ffffff",
				},
				{
					title: "XIAOMI 13T SERIES",
					name: "Đặt trước quà ngon",
					src: "http://dummyimage.com/690x300.png/dddddd/000000",
				},
				{
					title: "SMART TV LG 4K",
					name: "Giải trí thả ga",
					src: "http://dummyimage.com/690x300.png/dddddd/000000",
				},
				{
					title: "XIAOMI MI BAND 8",
					name: "Giá rẻ chốt ngay",
					src: "http://dummyimage.com/690x300.png/5fa2dd/ffffff",
				},
				{
					title: "GHẾ E-DRA",
					name: "Mở bán giá rẻ",
					src: "http://dummyimage.com/690x300.png/cc0000/ffffff",
				},
				{
					title: "GHẾ E-DRA 2",
					name: "Mở bán giá rẻ",
					src: "http://dummyimage.com/690x300.png/ff4444/ffffff",
				},
			].map((data, index) => ({ ...data, key: `ad-${index}`, src: data.src + `?text=${data.title}` })),

			vouncher: [
				{
					key: "vouncher-1",
					src: "http://dummyimage.com/690x300.png/cc0000/ffffff",
				},
				{
					key: "vouncher-2",
					src: "http://dummyimage.com/690x300.png/dddddd/000000",
				},
				{
					key: "vouncher-3",
					src: "http://dummyimage.com/690x300.png/5fa2dd/ffffff",
				},
			].map((data) => ({ ...data, src: data.src + `?text=${data.key}` })),
		};
	}, []);

	const [currentTab, setTab] = useState<(typeof showcaseData.images)[number]>(showcaseData.images[0]!);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const showcaseRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setTab((prev) => {
				const currentIndex = showcaseData.images.indexOf(prev);
				return showcaseData.images.at((currentIndex + 1) % showcaseData.images.length)!;
			});
		}, 10000);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [currentTab, showcaseData.images]);

	const handleImageChange = useCallback(
		function (direction: "next" | "previous") {
			if (intervalRef.current) clearInterval(intervalRef.current);

			setTab((prev) => {
				const currentIndex = showcaseData.images.indexOf(prev);
				const data =
					direction === "next"
						? showcaseData.images.at((currentIndex + 1) % showcaseData.images.length)!
						: showcaseData.images.at(
								currentIndex - 1 < 0 ? showcaseData.images.length - 1 : currentIndex - 1,
							)!;

				showcaseRef
					.current!.querySelector<HTMLButtonElement>(`#${data.key}`)
					?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

				return data;
			});
		},
		[showcaseData.images],
	);

	const handleTabClick = useCallback(
		function (item: (typeof showcaseData.images)[number]) {
			if (intervalRef.current) clearInterval(intervalRef.current);

			setTab(item);
			showcaseRef
				.current!.querySelector<HTMLButtonElement>(`#${item.key}`)
				?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
		},
		[showcaseData],
	);

	return (
		<section className="flex gap-2">
			<div className="flex flex-col overflow-hidden rounded">
				<div className="group relative w-full">
					<Button
						size="icon"
						variant="outline"
						className="absolute left-0 top-1/2 z-10 -translate-x-full rounded-l-none border-l-0 bg-black/60 group-hover:translate-x-0"
						onMouseDown={() => handleImageChange("previous")}
					>
						<ChevronLeft />
					</Button>

					<div
						className="flex w-full transition-[translate]"
						style={{ translate: -Math.abs(showcaseData.images.indexOf(currentTab)) + "00%" }}
					>
						{showcaseData.images.map((item) => (
							<div
								key={item.key}
								className="relative flex aspect-[690/300] min-w-full flex-shrink-0 flex-grow"
							>
								<Image fill unoptimized src={item.src} alt={item.name} />
							</div>
						))}
					</div>

					<Button
						size="icon"
						variant="outline"
						className="absolute right-0 top-1/2 z-10 translate-x-full rounded-r-none border-r-0 bg-black/60 group-hover:translate-x-0"
						onMouseDown={() => handleImageChange("next")}
					>
						<ChevronRight />
					</Button>
				</div>

				<div className="flex w-full overflow-x-scroll" ref={showcaseRef}>
					{showcaseData.images.map((item) => (
						<Button
							id={item.key}
							key={item.key}
							variant="ghost"
							onMouseDown={() => handleTabClick(item)}
							data-key={item.key.replaceAll(" ", "-")}
							className={cn(
								"h-full min-w-max flex-col rounded-none border-b-2 border-transparent py-2 outline-none",
								{ "border-foreground bg-accent": currentTab.key === item.key },
							)}
						>
							{item.title}
							<span className={cn({ "font-semibold": currentTab.key === item.key })}>{item.name}</span>
						</Button>
					))}
				</div>
			</div>

			<aside className="grid w-1/4 flex-shrink-0 grid-rows-3 gap-2">
				{showcaseData.vouncher.map((item) => (
					<div key={item.key} className="flex w-full flex-col gap-1">
						<div className="relative w-full flex-1 overflow-hidden rounded">
							<Image src={item.src} alt={item.key} unoptimized fill />
						</div>
						<span className="text-sm">{item.key}</span>
					</div>
				))}
			</aside>
		</section>
	);
}
