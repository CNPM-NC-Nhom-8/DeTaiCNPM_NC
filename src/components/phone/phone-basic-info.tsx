"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Landmark, PackageOpen, ShieldCheck, Smartphone } from "lucide-react";

export function PhoneBasicInfo() {
	return (
		<section>
			<Card>
				<CardHeader>
					<CardTitle className="text-xl">Thông tin sản phẩm</CardTitle>
				</CardHeader>

				<CardContent>
					<ul className="flex flex-col gap-2">
						<li className="flex items-start gap-2">
							<Smartphone size={20} className="flex-shrink-0" />
							<span>Mới, đầy đủ phụ kiện từ nhà sản xuất</span>
						</li>

						<li className="flex items-start gap-2">
							<PackageOpen size={20} className="flex-shrink-0" />
							<span> Máy, cáp, sách hướng dẫn, que chọc sim </span>
						</li>

						<li className="flex items-start gap-2">
							<Landmark size={20} className="flex-shrink-0" />
							<span> Giá sản phẩm đã bao gồm VAT </span>
						</li>

						<li className="flex items-start gap-2">
							<ShieldCheck size={20} className="flex-shrink-0" />
							<span>
								Bảo hành 12 tháng tại trung tâm bảo hành Chính hãng. 1 đổi 1 trong 30 ngày nếu có lỗi
								phần cứng từ nhà sản xuất. (xem chi tiết)
							</span>
						</li>
					</ul>
				</CardContent>
			</Card>
		</section>
	);
}
