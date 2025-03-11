import { PhoneCard } from "@/components/common/phone-card";
import { PhoneCardSkeleton } from "@/components/common/phone-card-skeleton";

import { db } from "@/server/db";

import { unstable_cacheLife } from "next/cache";

import type { Prisma } from "@prisma/client";

type ParamsType = {
	includeFavor?: Prisma.SanPhamMau$SanPhamYeuThichArgs;
	isSignedIn?: boolean;
};

export async function PopularPhonesSection({ includeFavor, isSignedIn }: ParamsType) {
	"use cache";
	unstable_cacheLife({ revalidate: 120, expire: 30 * 60 }); // revalidate every 120 seconds, expire after 30 minutes

	const data = await db.sanPhamMau.findMany({
		take: 10,
		include: { SanPhamBienThe: { include: { MatHang: true } }, SanPhamYeuThich: includeFavor },
	});

	return (
		<>
			{data.map((phone) => (
				<PhoneCard sanPhamMau={phone} key={phone.MaSPM} isSignedIn={isSignedIn} />
			))}
		</>
	);
}

export async function RecentPhonesSection({ includeFavor, isSignedIn }: ParamsType) {
	"use cache";
	unstable_cacheLife({ revalidate: 120, expire: 30 * 60 }); // revalidate every 120 seconds, expire after 30 minutes

	const data = await db.sanPhamMau.findMany({
		take: 10,
		orderBy: { NgayThem: "desc" },
		include: { SanPhamBienThe: { include: { MatHang: true } }, SanPhamYeuThich: includeFavor },
	});

	return (
		<>
			{data.map((phone) => (
				<PhoneCard sanPhamMau={phone} key={phone.MaSPM} isSignedIn={isSignedIn} />
			))}
		</>
	);
}

export async function PhonesSectionSkeletons({ id, length = 10 }: { id: string; length?: number }) {
	"use cache";
	unstable_cacheLife("max");

	return (
		<>
			{Array.from({ length }, (_, index) => (
				<PhoneCardSkeleton key={`phone-skeletons-${id}-${index}`} />
			))}
		</>
	);
}
