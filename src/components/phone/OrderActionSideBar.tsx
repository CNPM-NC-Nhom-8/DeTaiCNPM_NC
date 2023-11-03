"use client";

import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import { Badge, Button, ButtonGroup, Card, CardHeader, Radio, RadioGroup, Spinner } from "@nextui-org/react";
import type { Insurance } from "@prisma/client";

import { CheckIcon, DollarSign, ShieldCheck, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const InsuranceTypeOptions: { price: number; type: Insurance; description: string }[] = [
	{
		price: 1_100_000,
		type: "OneToOneVIP6Months",
		description: "1 đổi 1 VIP 6 tháng: Đổi máy mới tương đương khi có lỗi từ NSX trong 6 tháng",
	},
	{
		price: 1_600_000,
		type: "ReplacementOr12MonthsRepair",
		description:
			"S24 + 12 tháng: Đổi sản phẩm tương đương hoặc miễn phí chi phí sửa chữa nếu có lỗi của NSX khi hết hạn bảo hành trong 12 tháng",
	},
	{
		price: 1_800_000,
		type: "OneToOneVIP12Months",
		description: "1 đổi 1 VIP 12 tháng: Đổi máy mới tương đương khi có lỗi từ NSX trong 12 tháng",
	},
	{
		price: 2_400_000,
		type: "DropOrWaterDamage",
		description: "Rơi vỡ - Rớt nước: Hỗ trợ 90% chi phí sửa chữa, đổi mới sản phẩm nếu hư hỏng nặng trong 12 tháng",
	},
];

export const OrderActionSideBar = ({ data }: { data: RouterOutputs["sanPham"]["getSanPham"] }) => {
	const moneyFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "vnd" });

	const DungLuong = Array.from(new Set(data.SanPhamBienThe.sort((a, b) => a.Gia - b.Gia).map((SP) => SP.DungLuong)));
	const [selectedDungLuong, setDungLuong] = useState(DungLuong[0]);

	const MauSac = Array.from(new Set(data.SanPhamBienThe.sort().map((SP) => SP.Mau)));
	const [selectedMauSac, setMauSac] = useState(MauSac[0]);

	const [selectedInsurance, setInsurance] = useState<Insurance>("None");

	const trpcContext = api.useUtils();
	const themVaoGioHang = api.cart.themVaoGiohang.useMutation({
		onSuccess: async () => {
			await trpcContext.cart.layGioHang.refetch();
		},
	});

	useEffect(() => {
		const SP = data.SanPhamBienThe.filter(
			(SP) => SP.DungLuong === selectedDungLuong && SP.Mau === selectedMauSac,
		)[0];

		if (!SP) setMauSac(data.SanPhamBienThe.filter((SP) => SP.DungLuong === selectedDungLuong)[0]!.Mau);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedDungLuong]);

	return (
		<aside className="flex w-1/3 flex-shrink-0 flex-col gap-4">
			<section className="grid grid-cols-3 gap-4">
				{DungLuong.map((item, index) => {
					const SP = data.SanPhamBienThe.filter((SP) => SP.DungLuong === item)[index];

					return (
						<Badge
							key={SP!.MaSP}
							content={<CheckIcon size={16} />}
							isInvisible={selectedDungLuong !== item}
							disableOutline
							className="bg-success-500 text-success-foreground"
						>
							<div className="contents" onClick={() => setDungLuong(item)}>
								<Card
									className={`w-full cursor-pointer gap-1 border-2 border-transparent py-2 text-center text-sm ${
										selectedDungLuong === item && "border-success-500"
									}`}
								>
									<span className="font-semibold">{item}</span>
									<span>{moneyFormat.format(SP!.Gia)}</span>
								</Card>
							</div>
						</Badge>
					);
				})}
			</section>

			<h4 className="font-semibold">Chọn màu để xem giá và chi nhánh có hàng</h4>

			<section className="grid grid-cols-3 gap-2">
				{MauSac.map((item) => {
					const SP = data.SanPhamBienThe.filter(
						(SP) => SP.Mau === item && SP.DungLuong === selectedDungLuong,
					)[0];

					if (!SP) {
						const price = data.SanPhamBienThe.filter((SP) => SP.DungLuong === selectedDungLuong)[0]!.Gia;

						return (
							<Badge key={`${item}-${selectedDungLuong}-notFound`} disableOutline isInvisible>
								<div className="contents">
									<Card
										isDisabled
										className={
											"w-full cursor-not-allowed gap-2 border-2 border-transparent px-4 py-2 text-center text-sm"
										}
									>
										<div className="flex items-center gap-2">
											<span className="flex-grow font-semibold">{item}</span>
										</div>

										<span>{moneyFormat.format(price)}</span>
									</Card>
								</div>
							</Badge>
						);
					}

					return (
						<Badge
							key={SP.MaSP}
							disableOutline
							content={<CheckIcon size={16} />}
							isInvisible={selectedMauSac !== item}
							className="bg-success-500 text-success-foreground"
						>
							<div className="contents" onClick={() => setMauSac(item)}>
								<Card
									className={`w-full cursor-pointer gap-2 border-2 border-transparent px-4 py-2 text-center text-sm ${
										selectedMauSac === item && "border-success-500"
									}`}
								>
									<div className="flex items-center gap-2">
										<span className="flex-grow font-semibold">{item}</span>
									</div>

									<span>{moneyFormat.format(SP.Gia)}</span>
								</Card>
							</div>
						</Badge>
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
						onClick={() => {
							themVaoGioHang.mutate({ maSP: data.MaSPM, quanlity: 1, type: selectedInsurance });
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
