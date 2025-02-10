import { HistoryPaymentDetailsNav } from "@/components/history/details/HistoryPaymentDetailsNav";
import { InsuranceTypeOptions } from "@/components/phone/data";
import { dayjs, moneyFormat } from "@/utils/common";
import { api } from "@/utils/trpc/server";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card, CardBody, CardFooter, Image, Tooltip } from "@nextui-org/react";

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
		<main className="container grid max-w-2xl flex-grow grid-cols-1 grid-rows-[max-content,minmax(0,1fr)] gap-4 px-6 pt-4">
			<HistoryPaymentDetailsNav />

			<Card className="max-h-full overflow-auto">
				<h1 className="px-5 pt-2 text-xl font-semibold">Danh sách sản phẩm</h1>

				<CardBody className="flex flex-col gap-4 border-b-[1px] border-gray">
					{data?.CT_DonHang.map((item) => {
						const insuranceType = InsuranceTypeOptions.find(({ type }) => type === item.InsuranceType);

						return (
							<section key={item.MaCT_DH} className="flex gap-4">
								<Image
									width={150}
									classNames={{ img: "aspect-square" }}
									alt={item.SanPham.SanPhamMau.MoTa}
									src={item.SanPham.SanPhamMau.AnhBia}
								/>

								<div className="flex w-full flex-col gap-2">
									<h2 className="text-lg font-semibold">{item.SanPham.SanPhamMau.TenSP}</h2>
									<span className="text-small text-gray">
										Loại: {item.SanPham.DungLuong} - {item.SanPham.Mau}
									</span>

									<div className="flex justify-between">
										<span className="text-small text-gray">Số lượng: {item.SoLuong}</span>
										<span>{moneyFormat.format(item.SanPham.Gia * item.SoLuong)}</span>
									</div>

									<span className="text-small text-gray">
										Bảo hiểm:{" "}
										{insuranceType
											? insuranceType.description.split(": ").at(0) +
												" + " +
												moneyFormat.format(insuranceType.price)
											: "Không có"}
									</span>
								</div>
							</section>
						);
					})}
				</CardBody>

				<CardFooter>
					<div className="flex w-full items-center justify-between">
						<div className="flex items-center gap-2">
							<span>Ngày đặt:</span>
							<Tooltip showArrow content={dayjs(data.NgayDat).format("DD MMMM, YYYY, HH:mm")}>
								<span className="text-lg">{dayjs(data.NgayDat).fromNow()}</span>
							</Tooltip>
						</div>

						<div className="flex items-center gap-2">
							<span>Tổng số tiền:</span>
							<span className="text-2xl text-danger">{moneyFormat.format(data.TongTien)}</span>
						</div>
					</div>
				</CardFooter>
			</Card>
		</main>
	);
}
