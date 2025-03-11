"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ObjectTyped, cn, moneyFormat, sortStorage } from "@/utils/common";
import type { RouterOutputs } from "@/utils/trpc/react";
import { api } from "@/utils/trpc/react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { InsuranceTypeOptions } from "./data";

import { useRouter } from "next/navigation";

import { Badge } from "@nextui-org/react";
import { Insurance } from "@prisma/client";

import { CheckIcon, DollarSign, LoaderIcon, ShieldCheck, ShoppingCart } from "lucide-react";
import { parseAsStringLiteral, useQueryStates } from "nuqs";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import z from "zod";

export function PhoneOrderOptions({ data }: { data: RouterOutputs["product"]["getSanPham"] }) {
	const router = useRouter();

	const storagesAndAvaiableColors = useMemo(
		() =>
			data.SanPhamBienThe.sort((a, b) => sortStorage(a.DungLuong, b.DungLuong)).reduce(
				(data, { DungLuong, Mau }) => data.set(DungLuong, [...(data.get(DungLuong) ?? []), Mau]),
				new Map<string, string[]>(),
			),
		[data.SanPhamBienThe],
	);

	const storageSizes = useMemo(() => Array.from(storagesAndAvaiableColors.keys()), [storagesAndAvaiableColors]);
	const colors = useMemo(
		() => storagesAndAvaiableColors.get(storageSizes[0]!)!,
		[storagesAndAvaiableColors, storageSizes],
	);

	const [options, setOptions] = useQueryStates(
		{
			color: parseAsStringLiteral(colors).withDefault(colors[0]!),
			storage: parseAsStringLiteral(storageSizes).withDefault(storageSizes[0]!),
			insurance: parseAsStringLiteral(ObjectTyped.keys(Insurance)).withDefault("None"),
		},
		{ clearOnDefault: false },
	);

	const storageValidate = useCallback(
		(query?: string | null) => {
			return z
				.string()
				.nullish()
				.transform((value) => (value && storageSizes.includes(value) ? value : storageSizes[0]!))
				.parse(query);
		},
		[storageSizes],
	);

	const colorValidate = useCallback(
		(storage: string, color: string) => {
			return z
				.string()
				.nullish()
				.transform((value) => {
					const SP = data.SanPhamBienThe.find(({ DungLuong, Mau }) => DungLuong === storage && Mau === value);

					if (value && colors.includes(value) && (SP?.MatHang?.TonKho ?? 0) > 0) return value;
					const fallbackColor = data.SanPhamBienThe.find(
						({ DungLuong, MatHang }) => DungLuong === storage && (MatHang?.TonKho ?? 0) > 0,
					);

					toast.error(`Màu ${value} ${storage} đã không hết hàng`);
					return fallbackColor?.Mau;
				})
				.parse(color);
		},
		[colors, data.SanPhamBienThe],
	);

	const currentQuantity = useMemo(() => {
		const SP = data.SanPhamBienThe.find(
			({ DungLuong, Mau }) => DungLuong === options.storage && Mau === options.color,
		);
		return SP?.MatHang?.TonKho ?? 0;
	}, [data.SanPhamBienThe, options.color, options.storage]);

	const addToCart = api.cart.addItemIntoCart.useMutation({
		onSuccess: () => router.refresh(),
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	return (
		<aside className="flex w-1/3 flex-shrink-0 flex-col gap-4">
			<section className="grid grid-cols-3 gap-4">
				<h4 className="col-span-3 font-semibold">Chọn dung lượng của sản phẩm</h4>

				{storageSizes.map((size) => {
					const SP = data.SanPhamBienThe.find(({ DungLuong }) => DungLuong === size)!;

					return (
						<Badge
							key={[size, SP.MaSP].join("-")}
							content={<CheckIcon size={16} />}
							isInvisible={options.storage !== size}
							className="bg-success-500 text-success-foreground"
						>
							<Button
								asChild
								variant="outline"
								onMouseDown={() =>
									setOptions({
										storage: storageValidate(size),
										color: colorValidate(size, options.color),
									})
								}
								className={cn("w-full cursor-pointer gap-1 border-2 py-2 text-center text-sm", {
									"border-success": options.storage === size,
								})}
							>
								<span className="font-semibold">{size}</span>
							</Button>
						</Badge>
					);
				})}
			</section>

			<section className="grid grid-cols-3 gap-2">
				<h4 className="col-span-3 font-semibold">Chọn màu để xem giá</h4>

				{colors.map((color) => {
					const SP = data.SanPhamBienThe.find(
						({ DungLuong, Mau }) => DungLuong === options.storage && Mau === color,
					)!;

					return (
						<Badge
							key={[color, SP.MaSP].join("-")}
							content={<CheckIcon size={16} />}
							isInvisible={options.color !== color}
							className="bg-success text-success-foreground"
						>
							{SP.MatHang!.TonKho > 0 && (
								<Button
									variant="outline"
									onMouseDown={() => setOptions({ color: colorValidate(options.storage, color) })}
									className={cn(
										"flex h-max w-full cursor-pointer flex-col gap-2 border-2 text-center text-sm",
										{ "border-success": options.color === color },
									)}
								>
									<div className="flex items-center">
										<span className="flex-grow font-semibold">{color}</span>
									</div>

									<span>{moneyFormat.format(SP.Gia)}</span>
								</Button>
							)}

							{SP.MatHang!.TonKho <= 0 && (
								<Button
									disabled
									className="flex h-max w-full flex-col gap-2 border-2 border-white/20 bg-white/10 text-center text-sm text-gray"
								>
									<div className="flex items-center">
										<span className="flex-grow font-semibold">{color}</span>
									</div>

									<span>{moneyFormat.format(SP.Gia)}</span>
								</Button>
							)}
						</Badge>
					);
				})}
			</section>

			<section>
				<span>Số lượng tồn kho: {currentQuantity}</span>
			</section>

			<section className="flex flex-col gap-2">
				<div className="flex w-full">
					<Button
						className="flex flex-grow items-center gap-2 rounded-r-none"
						disabled={addToCart.isPending || currentQuantity <= 0}
						onMouseDown={async () => {
							const SP = data.SanPhamBienThe.find(
								({ DungLuong, Mau }) => DungLuong === options.storage && Mau === options.color,
							)!;

							await addToCart
								.mutateAsync({ maSP: SP.MaSP, quanlity: 1, insuranceOption: options.insurance })
								.then(() => router.push("/cart"))
								.catch(console.error);
						}}
					>
						<DollarSign size={20} /> Mua ngay
					</Button>

					<Button
						variant="outline"
						className="flex w-[40%] flex-shrink-0 items-center gap-2 rounded-l-none"
						disabled={addToCart.isPending}
						onMouseDown={() => {
							const SP = data.SanPhamBienThe.find(
								({ DungLuong, Mau }) => DungLuong === options.storage && Mau === options.color,
							)!;

							addToCart.mutate({ maSP: SP.MaSP, quanlity: 1, insuranceOption: options.insurance });
						}}
					>
						{addToCart.isPending ? (
							<LoaderIcon size={16} className="animate-spin" />
						) : (
							<>
								Thêm vào <ShoppingCart size={20} />
							</>
						)}
					</Button>
				</div>
			</section>

			<Card>
				<CardHeader className="gap-2">
					<CardTitle className="flex items-center gap-2">
						<ShieldCheck size={20} className="flex-shrink-0" /> Bảo vệ sản phẩm toàn diện với dịch vụ bảo
						hành mở rộng
					</CardTitle>
				</CardHeader>

				<CardContent>
					<RadioGroup
						defaultValue={options.insurance}
						onValueChange={(value) => setOptions({ insurance: value as keyof typeof Insurance })}
					>
						{InsuranceTypeOptions.map((data, index) => (
							<div
								className="group flex cursor-pointer items-center gap-3 rounded border border-transparent p-2 data-[selected=true]:border-success"
								data-selected={data.type === options.insurance}
								key={[data.type, index].join("-")}
							>
								<RadioGroupItem value={data.type} id={`options-${data.type}`.toLowerCase()} />

								<Label htmlFor={`options-${data.type}`.toLowerCase()} className="w-full cursor-pointer">
									<div className="flex flex-col justify-center gap-2 text-sm">
										<div className="flex items-center justify-between">
											<span>{data.title}</span>
											<span className="underline" title={data.description}>
												Chi tiết
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-red-600">{moneyFormat.format(data.price)}</span>
										</div>
									</div>
								</Label>
							</div>
						))}
					</RadioGroup>
				</CardContent>
			</Card>
		</aside>
	);
}
