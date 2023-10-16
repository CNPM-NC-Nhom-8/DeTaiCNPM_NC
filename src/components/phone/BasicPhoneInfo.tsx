"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { Smartphone, PackageOpen, ShieldCheck, Landmark } from "lucide-react";

export const BasicPhoneInfo = () => {
	return (
		<section>
			<Card>
				<CardHeader>
					<h3 className="text-xl">Thông tin sản phẩm</h3>
				</CardHeader>
				<CardBody className="px-3 pb-3 pt-0">
					<ul className="flex flex-col gap-2">
						<li className="flex items-start gap-2">
							<Smartphone size={20} className="flex-shrink-0" /> <span>Mới, đầy đủ phụ kiện từ nhà sản xuất</span>
						</li>
						<li className="flex items-start gap-2">
							<PackageOpen size={20} className="flex-shrink-0" />
							<span> Máy, cáp, sách hướng dẫn, que chọc sim </span>
						</li>
						<li className="flex items-start gap-2">
							<ShieldCheck size={20} className="flex-shrink-0" />
							<span>
								Bảo hành 12 tháng tại trung tâm bảo hành Chính hãng. 1 đổi 1 trong 30 ngày nếu có lỗi phần cứng từ nhà sản
								xuất. (xem chi tiết)
							</span>
						</li>
						<li className="flex items-start gap-2">
							<Landmark size={20} className="flex-shrink-0" />
							<span> Giá sản phẩm đã bao gồm VAT </span>
						</li>
					</ul>
				</CardBody>
			</Card>
		</section>
	);
};
