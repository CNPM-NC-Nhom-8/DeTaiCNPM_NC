import { Showcase } from "@/components/Home/Showcase";
import { PhoneCard } from "@/components/common/PhoneCard";
import Image from "next/image";

const phoneData = [
	{
		image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/g/a/galaxys23ultra_front_green_221122_2.jpg",
		name: "Samsung Galaxy S23 Ultra 256GB",
		description: "Nhận ngay ưu đãi YouTube Premium dành cho chủ sở hữu Samsung Galaxy và 2 km khác",
		stars: 5,
		price: 21_790_000,
		isFavored: false,
		sales: 32,
	},
];

export default function Home() {
	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-6 px-6 py-4">
			<Showcase />

			<section className="grid grid-cols-5 gap-4">
				<h3 className="col-span-5 text-2xl font-bold">Điện thoại nổi bật</h3>
				{Array(10)
					.fill(0)
					.map((phone) => {
						return <PhoneCard key={phone.name} />;
					})}
			</section>

			<section className="grid grid-cols-5 gap-4">
				<h3 className="col-span-5 text-2xl font-bold">Điện thoại mới</h3>
				{Array(10)
					.fill(0)
					.map((phone) => {
						return <PhoneCard key={phone.name} />;
					})}
			</section>
		</main>
	);
}

