"use client";

import { useProductData } from "./data";

import { Button, Card, Image } from "@nextui-org/react";

import { ChevronLeft, ChevronRight, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useStore } from "zustand";

export type ImageFileType = File & { preview: string };

export const Previews = () => {
	const state = useStore(useProductData, (state) => ({ setFiles: state.setFiles, files: state.files }));

	const [currentImage, setImage] = useState(state.files.at(0));

	const { getRootProps, getInputProps, open } = useDropzone({
		accept: { "image/*": [] },
		noClick: true,
		noKeyboard: true,
		onDrop: (acceptedFiles) => {
			state.setFiles(acceptedFiles);
			setImage(state.files.at(typeof currentImage === "undefined" ? 0 : -1));
		},
	});

	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () => state.files.forEach((file) => URL.revokeObjectURL(file.preview));
	}, []);

	return (
		<Card as="section" className="flex flex-grow flex-col gap-2 overflow-hidden rounded-lg">
			<div className="group relative w-full flex-grow">
				<Button
					isIconOnly
					startContent={<ChevronLeft />}
					className="absolute left-0 top-1/2 z-10 -translate-x-full rounded-l-none bg-black/60 transition-transform group-hover:translate-x-0"
					isDisabled={typeof currentImage === "undefined"}
					onPress={() => {
						setImage((prev) => {
							if (prev) {
								const currentIndex = state.files.indexOf(prev);
								return state.files.at(currentIndex - 1 < 0 ? -1 : currentIndex - 1)!;
							}
						});
					}}
				/>

				<div
					className="flex aspect-video w-full transition-all"
					style={{
						translate:
							-Math.abs(
								currentImage
									? state.files.indexOf(currentImage) - (state.files.length === 1 ? -1 : 0)
									: 0,
							) + "00%",
					}}
				>
					{state.files.map((file) => (
						<div key={["preview", file.name].join()} className="flex min-w-full flex-shrink-0 flex-grow">
							<Image
								src={file.preview}
								alt={file.name}
								onLoad={() => URL.revokeObjectURL(file.preview)}
								classNames={{ wrapper: "aspect-video w-full", img: "aspect-video object-contain" }}
								width={720}
							/>
						</div>
					))}
				</div>

				<Button
					isIconOnly
					startContent={<ChevronRight />}
					isDisabled={typeof currentImage === "undefined"}
					className="absolute right-0 top-1/2 z-10 translate-x-full rounded-r-none bg-black/60 transition-transform group-hover:translate-x-0"
					onPress={() => {
						setImage((prev) => {
							if (prev) {
								const currentIndex = state.files.indexOf(prev);
								return state.files.at(currentIndex + 1 >= state.files.length ? 0 : currentIndex + 1)!;
							}
						});
					}}
				/>
			</div>

			<div className="flex h-12 w-full gap-4 overflow-x-scroll px-2 scrollbar-hide">
				{state.files.map((item) => (
					<Button
						key={["small", item.name].join("-")}
						radius="none"
						className="h-full min-w-max flex-col p-0 outline-none"
						onPress={() => setImage(item)}
					>
						<Image radius="none" src={item.preview} alt="" className="aspect-square w-12 object-cover" />
					</Button>
				))}
			</div>

			<div {...getRootProps({ className: "px-2 pb-2" })}>
				<input {...getInputProps()} />
				<Button
					size="sm"
					onPress={open}
					color="primary"
					variant="shadow"
					startContent={<UploadCloud />}
					fullWidth
				>
					Thêm ảnh
				</Button>
			</div>
		</Card>
	);
};
