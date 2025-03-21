"use client";

import type { RouterOutputs } from "@/utils/trpc/react";
import { api } from "@/utils/trpc/react";

import { Button, Card, CardBody, CardFooter, CardHeader, Input, Select, SelectItem } from "@nextui-org/react";

export const EditProduct = ({ initialHangSX }: { initialHangSX: RouterOutputs["common"]["getHangSX"] }) => {
	const { data: HangSX } = api.common.getHangSX.useQuery(undefined, {
		initialData: initialHangSX,
	});

	return (
		<Card className="p-2">
			<CardHeader>
				<h1 className="text-lg font-semibold">Chỉnh sửa sản phẩm</h1>
			</CardHeader>

			<CardBody>
				<div className="mb-5 flex w-full flex-wrap gap-4 md:flex-nowrap">
					<Input type="text" label="Tên sản phẩm" />
				</div>

				<div className="mb-5 flex w-full flex-wrap gap-4 md:flex-nowrap">
					<Input type="text" label="Mô tả sản phẩm" />
				</div>

				<div className="mb-5 flex w-full flex-wrap gap-4 md:flex-nowrap">
					<Input type="text" label="Đặc điểm" />
				</div>

				<div className="mb-5 flex w-full flex-wrap gap-4 md:flex-nowrap">
					<label className="p-2 text-sm font-medium text-[#a6a6a7]" htmlFor="anhbia">
						Ảnh bìa
					</label>
					<input
						id="anhbia"
						type="file"
						accept="image/"
						className="block w-1/2 text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
					/>
				</div>

				<div className="mb-5 flex w-full flex-wrap gap-4 md:flex-nowrap">
					<Select label="Chọn hãng sản xuất" items={HangSX} className="max-w-xs">
						{(item) => <SelectItem key={item.MaHSX}>{item.TenHSX}</SelectItem>}
					</Select>
				</div>
			</CardBody>

			<CardFooter>
				<Button color="primary">Chỉnh sửa sản phẩm</Button>
			</CardFooter>
		</Card>
	);
};
