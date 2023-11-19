"use client";

import { FAQInput } from "@/components/admin/products/manage/FAQInput";
import { Previews } from "@/components/admin/products/manage/ImageDropzone";
import { TypeAdder } from "@/components/admin/products/manage/TypeAdder";
import { detailsKeys, useProductData } from "@/components/admin/products/manage/data";
import { PhoneDetailInfo } from "@/components/phone/PhoneDetailInfo";
import { ThongSoKeyVietnamese } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import { Button, Card, CardBody, Divider, Input, type PropsOf, Select, SelectItem, Textarea } from "@nextui-org/react";

import { useState } from "react";
import toast from "react-hot-toast";
import { useStore } from "zustand";

export const CreateProduct = ({ hangSX }: { hangSX: RouterOutputs["common"]["getHangSX"] }) => {
	const state = useStore(useProductData, (state) => state);

	const addProduct = api.admin.addProduct.useMutation({
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	const [selectedInfoKey, setSelectedInfoKey] = useState("");
	const [infoValue, setInfoValue] = useState("");

	return (
		<main className="flex flex-grow flex-col gap-6">
			<Input
				label="Tên Sản phẩm"
				placeholder="Nhập tên sản phẩm"
				labelPlacement="outside"
				value={state.name}
				onValueChange={(value) => state.setName(value)}
			/>

			<Divider orientation="horizontal" />

			<section className="flex gap-4">
				<div className="flex flex-grow flex-col gap-4">
					<Previews />

					<Card>
						<CardBody>
							<Textarea
								label="Mô tả"
								labelPlacement="outside"
								value={state.description}
								classNames={{ label: "text-xl font-semibold text-center", input: "resize-y" }}
								onValueChange={(value) => state.setDescription(value)}
							/>
						</CardBody>
					</Card>
				</div>

				<aside className="flex w-1/3 flex-shrink-0 flex-col gap-4">
					<Select label="Hãng sản xuất" labelPlacement="outside" placeholder="Chọn 1 hãng sản xuất">
						{hangSX.map((hangSX) => (
							<SelectItem key={hangSX.MaHSX}>{hangSX.TenHSX}</SelectItem>
						))}
					</Select>

					<Divider orientation="horizontal" />

					<TypeAdder />
				</aside>
			</section>

			<section className="flex gap-4">
				<div className="flex flex-grow flex-col gap-4">
					<Card>
						<CardBody>
							<Textarea
								label="Đặt điểm nổi bặt"
								labelPlacement="outside"
								value={state.features}
								classNames={{ label: "text-xl font-semibold text-center", input: "resize-y" }}
								onValueChange={(value) => state.setFeatures(value)}
							/>
						</CardBody>
					</Card>

					<FAQInput />
				</div>

				<aside className="flex w-1/3 flex-shrink-0 flex-col gap-4">
					<Card>
						<CardBody className="gap-4">
							<h3 className="px-2 text-center text-xl font-semibold">Thông tin kỹ thuật</h3>

							<Select
								labelPlacement="outside"
								placeholder="Chọn 1 thông tin"
								disallowEmptySelection
								onChange={(event) => setSelectedInfoKey(event.target.value.slice("info-".length))}
							>
								{detailsKeys.map((key) => {
									const info = ThongSoKeyVietnamese(key);
									return <SelectItem key={["info", key].join("-")}>{info}</SelectItem>;
								})}
							</Select>

							<Textarea
								label="Thông tin kỹ thuật"
								labelPlacement="outside"
								placeholder="Nội dung thông tin"
								value={infoValue}
								onValueChange={setInfoValue}
							/>

							<Button
								color="success"
								isDisabled={selectedInfoKey.length === 0 || infoValue.length === 0}
								onPress={() => state.setDetails(selectedInfoKey, infoValue)}
							>
								Thêm thông tin
							</Button>
						</CardBody>
					</Card>

					<PhoneDetailInfo data={state.details as PropsOf<typeof PhoneDetailInfo>["data"]} />
				</aside>
			</section>

			<section>
				<Button
					fullWidth
					color="success"
					isLoading={addProduct.isLoading}
					onPress={async () => {
						const formData = new FormData();
						state.files.map((file) => formData.append("file", file));

						const data = (await (
							await fetch("/api/admin/image/upload", {
								method: "POST",
								body: formData,
							})
						).json()) as { path: string }[];

						await addProduct.mutateAsync({ ...state, files: data });
					}}
				>
					Thêm sản phẩm
				</Button>
			</section>
		</main>
	);
};
