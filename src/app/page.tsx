import { Showcase } from "@/components/Home/Showcase";
import { PhoneCard } from "@/components/common/PhoneCard";

import { serverClient } from "@/utils/trpc/server";

export default async function Home() {
	const data = await serverClient.sanPham.getSanPham({});

	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-6 px-6 py-4">
			<Showcase />

			<section className="grid grid-cols-5 gap-4">
				<h3 className="col-span-5 text-2xl font-bold">Điện thoại nổi bật</h3>

				{Array(10)
					.fill(0)
					.map((phone, index) => {
						return <PhoneCard sanPhamMau={data!} key={data!.MaSPM + index * 2} />;
					})}
			</section>

			<section className="grid grid-cols-5 gap-4">
				<h3 className="col-span-5 text-2xl font-bold">Điện thoại mới</h3>

				{Array(10)
					.fill(0)
					.map((phone, index) => {
						return <PhoneCard sanPhamMau={data!} key={data!.MaSPM + index * 3} />;
					})}
			</section>
		</main>
	);
}

