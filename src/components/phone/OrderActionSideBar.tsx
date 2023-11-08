"use client";

import { cn, moneyFormat } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import { InsuranceTypeOptions } from "./data";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Badge, Button, ButtonGroup, Card, CardHeader, Radio, RadioGroup, Spinner } from "@nextui-org/react";
import type { Insurance } from "@prisma/client";

import { CheckIcon, DollarSign, ShieldCheck, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import z from "zod";

export const OrderActionSideBar = ({ data }: { data: RouterOutputs["product"]["getSanPham"] }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const dungLuong = useMemo(
		() => Array.from(new Set(data.SanPhamBienThe.map((SP) => SP.DungLuong))),
		[data.SanPhamBienThe],
	);

	const storageValidate = useMemo(() => {
		return z
			.string()
			.nullish()
			.transform((value) => {
				return value && dungLuong.includes(value) ? value : dungLuong[0]!;
			});
	}, [dungLuong]);

	const selectedStorage = storageValidate.parse(searchParams.get("storage"));

	const mauSac = useMemo(
		() =>
			Array.from(
				new Set(
					data.SanPhamBienThe.filter(({ DungLuong }) => DungLuong === selectedStorage).map(({ Mau }) => Mau),
				),
			),
		[data.SanPhamBienThe, selectedStorage],
	);

	const colorValidate = useMemo(() => {
		return z
			.string()
			.nullish()
			.transform((value) => {
				if (value && mauSac.includes(value)) return value;

				const defaultColor = mauSac[0]!;
				const searchParams = new URLSearchParams();

				searchParams.set("storage", selectedStorage);
				searchParams.set("color", defaultColor);

				router.replace(pathname + "?" + searchParams.toString());

				return defaultColor;
			});
	}, [mauSac, selectedStorage]);

	const selectedColor = colorValidate.parse(searchParams.get("color"));

	const [selectedInsurance, setInsurance] = useState<Insurance>("None");

	const trpcContext = api.useUtils();
	const themVaoGioHang = api.cart.addItemIntoCart.useMutation({
		onSuccess: async () => await trpcContext.cart.getCartItems.refetch(),
	});

	return (
		<aside className="flex w-1/3 flex-shrink-0 flex-col gap-4">
			<section className="grid grid-cols-3 gap-4">
				<h4 className="col-span-3 font-semibold">Chọn dung lượng của sản phẩm</h4>

				{dungLuong.map((item) => {
					const SP = data.SanPhamBienThe.find(({ DungLuong }) => DungLuong === item)!;

					return (
						<Badge
							key={[item, SP.MaSP].join("-")}
							content={<CheckIcon size={16} />}
							isInvisible={selectedStorage !== item}
							className="bg-success-500 text-success-foreground"
						>
							<Link
								className="contents"
								href={{ pathname, query: { storage: item, color: selectedColor } }}
							>
								<Card
									className={cn(
										"w-full cursor-pointer gap-1 border-2 border-transparent py-2 text-center text-sm",
										{ "border-success-500": selectedStorage === item },
									)}
								>
									<span className="font-semibold">{item}</span>
								</Card>
							</Link>
						</Badge>
					);
				})}
			</section>

			<section className="grid grid-cols-3 gap-2">
				<h4 className="col-span-3 font-semibold">Chọn màu để xem giá</h4>

				{mauSac.map((item) => {
					const SP = data.SanPhamBienThe.find(
						({ DungLuong, Mau }) => DungLuong === selectedStorage && Mau === selectedColor,
					)!;

					return (
						<>
							<Badge
								key={[item, SP.MaSP].join("-")}
								content={<CheckIcon size={16} />}
								isInvisible={selectedColor !== item}
								className="bg-success-500 text-success-foreground"
							>
								<Link
									className="contents"
									href={{ pathname, query: { storage: selectedStorage, color: item } }}
								>
									<Card
										className={cn(
											"w-full cursor-pointer gap-2 border-2 border-transparent px-4 py-2 text-center text-sm",
											{ "border-success-500": selectedColor === item },
										)}
									>
										<div className="flex items-center gap-2">
											<span className="flex-grow font-semibold">{item}</span>
										</div>

										<span>{moneyFormat.format(SP.Gia)}</span>
									</Card>
								</Link>
							</Badge>
						</>
					);
				})}
			</section>

			<section className="flex flex-col gap-2">
				<ButtonGroup className="w-full">
					<Button color="success" size="lg" startContent={<DollarSign size={20} />} className="w-2/3 text-lg">
						Mua ngay
					</Button>

					<Button
						size="lg"
						color="success"
						variant="bordered"
						spinnerPlacement="end"
						className="w-max px-2"
						isLoading={themVaoGioHang.isLoading}
						spinner={<Spinner color="success" size="sm" />}
						endContent={!themVaoGioHang.isLoading && <ShoppingCart size={20} />}
						onPress={() => {
							const SP = data.SanPhamBienThe.find(
								({ DungLuong, Mau }) => DungLuong === selectedStorage && Mau === selectedColor,
							)!;

							themVaoGioHang.mutate({ maSP: SP.MaSP, quanlity: 1, type: selectedInsurance });
						}}
					>
						Thêm vào
					</Button>
				</ButtonGroup>
			</section>

			<Card>
				<CardHeader className="gap-2">
					<ShieldCheck className="flex-shrink-0" /> Bảo vệ sản phẩm toàn diện với dịch vụ bảo hành mở rộng
				</CardHeader>

				<div className="px-3 pb-3">
					<RadioGroup
						classNames={{ wrapper: "gap-4" }}
						value={selectedInsurance}
						onValueChange={(value) => setInsurance(value as Insurance)}
					>
						{InsuranceTypeOptions.map((InsuranceData, index) => {
							return (
								<Radio
									key={[InsuranceData.type, index].join("-")}
									color="success"
									className="group rounded-lg border-2 border-transparent p-2 data-[selected=true]:border-success"
									value={InsuranceData.type}
								>
									<div className="flex flex-col justify-center gap-2 text-sm">
										<span className="block">{InsuranceData.description}</span>
										<div className="flex items-center justify-between">
											<span className="text-red-600 group-data-[selected=true]:text-success">
												{moneyFormat.format(InsuranceData.price)}
											</span>

											<Button size="sm" color="danger" variant="light">
												Xem Thêm Chi Tiết
											</Button>
										</div>
									</div>
								</Radio>
							);
						})}
					</RadioGroup>
				</div>
			</Card>
		</aside>
	);
};
