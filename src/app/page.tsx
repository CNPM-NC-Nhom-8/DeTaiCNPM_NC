import { PhonesSectionSkeletons, PopularPhonesSection, RecentPhonesSection } from "@/components/home/phone-sections";
import { Showcase } from "@/components/home/showcase";

import { auth } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";

import { Suspense } from "react";

export default async function Home() {
	const user = await auth();

	const includeFavor: Prisma.SanPhamMau$SanPhamYeuThichArgs<DefaultArgs> | undefined = user?.userId
		? { where: { MaKhachHang: user.userId }, take: 1, select: { MaKhachHang: true } }
		: undefined;

	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-6 px-6 py-4">
			<Showcase />

			<section className="grid grid-cols-5 gap-4">
				<h3 className="col-span-5 text-2xl font-bold">Điện thoại phổ biến</h3>

				<Suspense fallback={<PhonesSectionSkeletons id="popular-phones" />}>
					<PopularPhonesSection isSignedIn={user.userId !== null} includeFavor={includeFavor} />
				</Suspense>
			</section>

			<section className="grid grid-cols-5 gap-4">
				<h3 className="col-span-5 text-2xl font-bold">Điện thoại mới</h3>

				<Suspense fallback={<PhonesSectionSkeletons id="recent-phones" />}>
					<RecentPhonesSection isSignedIn={user.userId !== null} includeFavor={includeFavor} />
				</Suspense>
			</section>
		</main>
	);
}
