import { moneyFormat } from "@/utils/common";
import type { RouterOutputs } from "@/utils/trpc/react";

import { InsuranceTypeOptions } from "../phone/data";

import Link from "next/link";

import { Button, Card, CardBody } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

export const HistoryPaymentTable = ({ data }: { data: RouterOutputs["taiKhoan"]["getPaymentHistories"][number] }) => {
	return (
		<Card className="w-full">
			<CardBody className="flex w-full flex-col gap-4">
				<section className="flex flex-col gap-4">
					{data.CT_DonHang.map((item) => {
						const insuranceType = InsuranceTypeOptions.find(({ type }) => type === item.InsuranceType);

						return (
							<div className="flex gap-4" key={item.MaCT_DH}>
								<Image
									width={150}
									className="aspect-square"
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
							</div>
						);
					})}

					{data._count.CT_DonHang > 2 && (
						<div className="text-center text-small text-gray">
							<span>Còn {data._count.CT_DonHang - 2} sản phẩm nữa...</span>
						</div>
					)}
				</section>

				<section className="flex w-full justify-between">
					<div className="flex items-center gap-2">
						<span className="text-small">Tổng số tiền:</span>
						<span className="text-lg text-danger">{moneyFormat.format(data.TongTien)}</span>
					</div>

					<Button as={Link} href={`/auth/account/history/payment/detail/${data.MaDonHang}`} color="success">
						Xem chi tiết
					</Button>
				</section>
			</CardBody>
		</Card>
	);
};
