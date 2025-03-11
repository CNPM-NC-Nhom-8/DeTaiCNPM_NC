import { BackButton } from "@/components/common/back-button";
import { InsuranceTypeOptions } from "@/components/phone/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { dayjs, moneyFormat, numberFormat } from "@/utils/common";
import { api } from "@/utils/trpc/server";

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { cache } from "react";

const getData = cache(async ({ id }: { id: string }) => {
	return await api.taiKhoan.getPaymentDetails({ MaDonHang: id });
});

export const generateMetadata = async ({ params: { id } }: { params: { id: string } }): Promise<Metadata> => {
	const data = await getData({ id });
	if (!data) return { title: "Trang 404 - Lỗi trang không tồn tại!" };

	return { title: "Thông tin chi tiết đơn hàng " + data.MaDonHang };
};

export default async function Page({ params: { id } }: { params: { id: string } }) {
	const data = await getData({ id });
	if (!data) notFound();

	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-4 px-6 py-4">
			<nav className="flex w-full items-center justify-between">
				<BackButton />
				<h3 className="justify-center text-2xl font-semibold">Chi tiết đơn hàng</h3>
				<span></span>
			</nav>

			<Card className="max-h-full overflow-auto">
				<CardHeader>
					<CardTitle className="text-xl font-semibold">Danh sách sản phẩm</CardTitle>
				</CardHeader>

				<CardContent className="flex flex-col gap-2">
					{data?.CT_DonHang.map((item, index) => {
						const insurance = InsuranceTypeOptions.find(({ type }) => type === item.InsuranceType);

						return (
							<section key={item.MaCT_DH} className="flex gap-4" id={item.MaCT_DH} data-index={index}>
								<Image
									width={128}
									height={128}
									unoptimized
									className="size-32 flex-shrink-0 rounded object-cover object-center"
									alt={item.SanPham.SanPhamMau.MoTa}
									src={item.SanPham.SanPhamMau.AnhBia}
								/>

								<div className="flex w-full flex-col gap-1 text-sm text-gray">
									<div className="flex w-full items-center justify-between">
										<h2 className="text-lg font-semibold">{item.SanPham.SanPhamMau.TenSP}</h2>
										<span>#{index + 1}</span>
									</div>
									<span className="text-gray">
										Loại: {item.SanPham.DungLuong} - {item.SanPham.Mau} - Giá:{" "}
										{moneyFormat.format(item.SanPham.Gia)}
									</span>

									<span>Số lượng: {item.SoLuong}</span>

									<span>
										{insurance
											? `${insurance.title}: ${insurance.description} + ${moneyFormat.format(insurance.price)}`
											: "Không có: Sản phảm không có bảo hành + 0 ₫"}
									</span>

									<div>
										<span>Tổng tiền cho sản phẩm: </span>
										<span>
											{numberFormat.format(item.SanPham.Gia)} * {item.SoLuong} +{" "}
											{numberFormat.format(insurance?.price ?? 0)} ={" "}
										</span>
										<span className="underline underline-offset-2">
											{moneyFormat.format(
												item.SanPham.Gia * item.SoLuong + (insurance?.price ?? 0),
											)}
										</span>
									</div>
								</div>
							</section>
						);
					})}
				</CardContent>

				<CardFooter>
					<div className="flex w-full items-center justify-between">
						<div className="flex items-center gap-2 text-sm">
							<span>Ngày đặt:</span>

							<span className="capitalize" title={dayjs(data.NgayDat).format("DD MMMM, YYYY, HH:mm")}>
								{dayjs(data.NgayDat).format("Lúc HH:mm - Ngày DD MMMM YYYY")}
							</span>
						</div>

						<div className="flex items-center gap-2">
							<span>Tổng số tiền:</span>
							<span className="text-danger">{moneyFormat.format(data.TongTien)}</span>
						</div>
					</div>
				</CardFooter>
			</Card>
		</main>
	);
}
