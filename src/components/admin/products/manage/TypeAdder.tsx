"use state";

import { ObjectKeys, moneyFormat } from "@/utils/common";

import { useProductData } from "./data";

import { Badge, Button, Chip, Input } from "@nextui-org/react";

import { CheckIcon, Plus, Save } from "lucide-react";
import { useState } from "react";
import { useStore } from "zustand";

export const TypeAdder = () => {
	const state = useStore(useProductData, (state) => ({
		types: state.types,
		addStorageType: state.addStorageType,
		removeStorageType: state.removeStorageType,
	}));

	const [storageText, setStorageText] = useState("");
	const [selectedStorage, setSelectedStorage] = useState<string | undefined>();

	return (
		<>
			<section className="flex flex-col gap-4">
				<div className="flex items-end">
					<Input
						label="Dung lượng"
						labelPlacement="outside"
						value={storageText}
						onValueChange={setStorageText}
						placeholder="Thêm 1 loại dung lượng"
						classNames={{ inputWrapper: "rounded-r-none" }}
						onKeyDown={(event) => {
							if (event.key === "Enter" && event.ctrlKey) {
								event.preventDefault();

								state.addStorageType(storageText);
								setStorageText("");
							}
						}}
					/>

					<Button
						isIconOnly
						startContent={<Plus />}
						className="rounded-l-none"
						onPress={() => {
							state.addStorageType(storageText);
							setStorageText("");
						}}
					/>
				</div>

				<div className="grid grid-cols-3 gap-4">
					{ObjectKeys(state.types).map((type) => {
						return (
							<Badge
								key={["storage", type].join("-")}
								content={<CheckIcon size={16} />}
								isInvisible={selectedStorage !== type}
								className="bg-success-500 text-success-foreground"
							>
								<Chip
									size="lg"
									radius="md"
									onClose={() => {
										state.removeStorageType(type);
										setSelectedStorage(undefined);
									}}
									classNames={{ base: "max-w-full w-full cursor-pointer", content: "text-center" }}
									variant={selectedStorage === type ? "bordered" : "solid"}
									color={selectedStorage === type ? "success" : "default"}
									onClick={() => setSelectedStorage(type)}
								>
									{type}
								</Chip>
							</Badge>
						);
					})}
				</div>
			</section>

			{selectedStorage && <ColorInput selectedStorage={selectedStorage} />}
		</>
	);
};

const ColorInput = ({ selectedStorage }: { selectedStorage: string }) => {
	const state = useStore(useProductData, (state) => ({
		types: state.types,

		addColorType: state.addColorType,
		removeColorType: state.removeColorType,
	}));

	const [colorText, setColorText] = useState("");
	const [selectedColor, setSelectedColor] = useState<string | undefined>();

	const [price, setPrice] = useState(0);
	const [quanlity, setQuanlity] = useState(0);

	return (
		<section className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<div className="flex items-end">
					<Input
						label="Màu sắc"
						labelPlacement="outside"
						value={colorText}
						onValueChange={setColorText}
						placeholder="Thêm 1 loại màu"
						classNames={{ inputWrapper: "rounded-r-none" }}
					/>

					<Button
						isIconOnly
						startContent={selectedColor ? <Save /> : <Plus />}
						className="rounded-l-none"
						onPress={() => {
							state.addColorType(selectedStorage, {
								color: selectedColor ?? colorText,
								price,
								quanlity,
							});

							setColorText("");
							setPrice(0);
							setQuanlity(0);
							setSelectedColor(undefined);
						}}
					/>
				</div>

				<div className="flex gap-4">
					<Input
						label="Giá"
						size="sm"
						labelPlacement="outside"
						value={price.toString()}
						onValueChange={(value) => setPrice(Number(value))}
						type="number"
						placeholder="0.00"
						startContent={
							<div className="pointer-events-none flex items-center">
								<span className="text-small text-default-400">$</span>
							</div>
						}
					/>

					<Input
						label="Số lượng"
						size="sm"
						labelPlacement="outside"
						value={quanlity.toString()}
						onValueChange={(value) => setQuanlity(Number(value))}
						type="number"
						placeholder="0.00"
					/>
				</div>
			</div>

			<div className="flex flex-wrap gap-4">
				{ObjectKeys(state.types[selectedStorage]!).map((type) => {
					const item = state.types[selectedStorage]![type];

					return (
						<Badge
							key={["storage", type].join("-")}
							content={<CheckIcon size={16} />}
							isInvisible={selectedColor !== type}
							className="bg-success-500 text-success-foreground"
						>
							<Chip
								size="lg"
								radius="md"
								onClose={() => state.removeColorType(selectedStorage, type)}
								classNames={{
									base: "max-w-full w-full cursor-pointer h-auto",
									content: "text-center",
								}}
								variant={"bordered"}
								color={selectedColor === type ? "success" : "default"}
								onClick={() => {
									setQuanlity(item?.quanlity ?? 0);
									setPrice(item?.price ?? 0);
									setColorText(type);
									setSelectedColor(type);
								}}
							>
								<div className="flex flex-col gap-2 py-2">
									<span className="font-semibold">
										{type} - {item?.quanlity ?? 0}
									</span>
									<span>{moneyFormat.format(item?.price ?? 0)}</span>
								</div>
							</Chip>
						</Badge>
					);
				})}
			</div>
		</section>
	);
};
