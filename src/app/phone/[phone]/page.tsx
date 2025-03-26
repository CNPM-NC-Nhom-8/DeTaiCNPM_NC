import { CommentSection } from "@/components/comment/comment-section";
import { FAQ } from "@/components/phone/FAQ";
import { PhoneImageShowcase } from "@/components/phone/ImageShowcase";
import { MorePhonesSection } from "@/components/phone/more-phones-section";
import { PhoneBasicInfo } from "@/components/phone/phone-basic-info";
import { PhoneDetailInfo } from "@/components/phone/phone-details";
import { PhoneFeatures } from "@/components/phone/phone-features";
import { PhoneOrderOptions } from "@/components/phone/phone-order-options";

import { db } from "@/server/db";
import { exclude } from "@/utils/common";
import { HydrateClient, api } from "@/utils/trpc/server";

import type { Metadata } from "next";
import { unstable_cacheLife } from "next/cache";
import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { Suspense } from "react";

type PropsType = { params: Promise<{ phone: string }> };

async function getPhoneFromParams(encodePhoneName: string) {
	"use cache";
	unstable_cacheLife("hours");

	const data = await db.sanPhamMau.findUnique({
		where: { TenSP: decodeURIComponent(encodePhoneName) },
		include: {
			HinhAnh: true,
			SanPhamBienThe: { include: { MatHang: true }, orderBy: [{ Gia: "asc" }, { Mau: "desc" }] },
			ThongSoKyThuat: true,
			FAQ: true,
		},
	});

	if (!data) return null;
	return { ...data, ThongSoKyThuat: exclude(data.ThongSoKyThuat!, ["MaSPM", "MaThongSo"]) };
}

export const generateMetadata = async ({ params }: PropsType): Promise<Metadata> => {
	const { phone: encodePhone } = await params;
	const data = await getPhoneFromParams(encodePhone);

	if (!data) return { title: "Sản phẩm không tồn tại" };
	return {
		title: data.TenSP,
		description: data.MoTa,
		openGraph: {
			title: data.TenSP,
			description: data.MoTa,
			images: data.AnhBia,
		},
	};
};

export default async function Page({ params }: PropsType) {
	const { phone: encodePhone } = await params;

	const user = await auth();
	const data = await getPhoneFromParams(encodePhone);
	if (!data) notFound();

	void api.comment.getDanhGia.prefetchInfinite({ maSPM: data.MaSPM, limit: 5 });

	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-6 px-6 py-4">
			<h3 className="text-xl font-bold">{data.TenSP}</h3>

			<section className="flex gap-4">
				<div className="flex flex-col gap-4">
					<PhoneImageShowcase images={data.HinhAnh} />
					<PhoneBasicInfo />
				</div>

				<PhoneOrderOptions data={data} />
			</section>

			<MorePhonesSection maHSX={data.MaHSX} maSPM={data.MaSPM} isSignedIn={user.userId !== null} />

			<section className="flex w-full gap-4">
				<div className="flex flex-grow flex-col gap-4">
					<PhoneFeatures text={data.DacDiem} />
					<FAQ data={data.FAQ} />

					<HydrateClient>
						<Suspense fallback={<div className="flex h-96 items-center justify-center">Loading...</div>}>
							<CommentSection sanPham={data} userPromise={api.common.getCurrentUser()} />
						</Suspense>
					</HydrateClient>
				</div>

				<aside className="flex w-1/3 flex-shrink-0 flex-col gap-4">
					<PhoneDetailInfo data={data.ThongSoKyThuat} />
				</aside>
			</section>
		</main>
	);
}
