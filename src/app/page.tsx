import { PhoneCard } from "@/components/common/PhoneCard";
import { Showcase } from "@/components/home/Showcase";
import { db } from "@/server/db";

export default async function Home() {
	const data = await db.sanPhamMau.findMany({ include: { SanPhamBienThe: true } });

	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-6 px-6 py-4">
			<Showcase />

			<section className="grid grid-cols-5 gap-4">
				<h3 className="col-span-5 text-2xl font-bold">Điện thoại nổi bật</h3>

				{data.map((phone) => {
					return <PhoneCard sanPhamMau={phone} key={phone.MaSPM} />;
				})}
			</section>

			{/* <section className="grid grid-cols-5 gap-4">
				<h3 className="col-span-5 text-2xl font-bold">Điện thoại mới</h3>

				
			</section> */}
		</main>
	);
}
