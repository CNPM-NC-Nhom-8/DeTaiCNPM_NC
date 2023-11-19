import { DanhGiaSanPham } from "@/components/comment/DanhGia";
import { BasicPhoneInfo } from "@/components/phone/BasicPhoneInfo";
import { FAQ } from "@/components/phone/FAQ";
import { PhoneImageShowcase } from "@/components/phone/ImageShowcase";
import { OrderActionSideBar } from "@/components/phone/OrderActionSideBar";
import { PhoneDetailInfo } from "@/components/phone/PhoneDetailInfo";
import { PhoneFeatures } from "@/components/phone/PhoneFeature";
import { RelatePhone } from "@/components/phone/RelatePhone";
import { api } from "@/utils/trpc/server";

import type { Metadata } from "next";

type PropsType = {
	params: { phone: string };
};

export const generateMetadata = async ({ params: { phone: encodePhone } }: PropsType): Promise<Metadata> => {
	const sanPham = await api.product.getSanPham.query({ tenSP: encodePhone });

	if (!sanPham) return { title: "Sản phẩm không tồn tại" };
	return { title: sanPham.TenSP };
};

export default async function Page({ params: { phone: encodePhone } }: PropsType) {
	const [data, user] = await Promise.all([
		api.product.getSanPham.query({ tenSP: encodePhone }),
		api.common.getCurrentUser.query(),
	]);

	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-6 px-6 py-4">
			<h3 className="text-xl font-bold">{data.TenSP}</h3>

			<section className="flex gap-4">
				<div className="flex flex-col gap-4">
					<PhoneImageShowcase images={data.HinhAnh} />
					<BasicPhoneInfo />
				</div>

				<OrderActionSideBar data={data} />
			</section>

			<RelatePhone maHSX={data.MaHSX} />

			<section className="flex gap-4">
				<div className="flex flex-grow flex-col gap-4">
					<PhoneFeatures>{data.DacDiem}</PhoneFeatures>

					<FAQ data={data.FAQ} />

					<DanhGiaSanPham sanPham={data} user={user} />
				</div>

				<aside className="flex w-1/3 flex-shrink-0 flex-col gap-4">
					<PhoneDetailInfo data={data.ThongSoKyThuat} />
				</aside>
			</section>
		</main>
	);
}
