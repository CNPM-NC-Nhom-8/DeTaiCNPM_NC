"use client";

import { CartNav } from "@/components/Cart/Nav";
import { Button } from "@/components/common/Button";
import { PhoneCard } from "@/components/common/PhoneCard";
import { countAtom } from "@/server/jotai/cart";
import { Card, Image, Input } from "@nextui-org/react";

import { useAtom } from "jotai";
import { ShoppingCart, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const data = {
	image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:350:0/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-den_1.png",
	price: 21_790_000,
};

export default function Page() {
	// const [cartCount] = useAtom(countAtom);
	const [cartCount, setCount] = useState(1);
	const moneyFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "vnd" });

	return (
		<main className="container flex max-w-5xl flex-grow flex-col gap-4 px-6 py-4">
			<CartNav cartLength={cartCount} />

			{cartCount === 0 && (
				<>
					<div className="flex w-full flex-grow flex-col items-center justify-center">
						<ShoppingCart size={48} absoluteStrokeWidth />

						<span>Giỏ hàng của bạn đang trống</span>
						<span>Hãy chọn thêm sản phẩm để mua sắm nhé</span>
					</div>

					<div>
						<Button as={Link} href={"/"} color="primary" className="w-full">
							Quay về trang chủ
						</Button>
					</div>
				</>
			)}

			{cartCount > 0 && (
				<div className="flex flex-col items-center justify-center">
					<div className="flex flex-col items-center justify-center gap-2">
						{Array(5)
							.fill(0)
							.map((item, index) => {
								return (
									<div key={index}>
										<Card className="flex-row gap-4 px-4 py-2">
											<div className="w-20">
												<Image src={data.image} />
											</div>
											<div className="flex flex-col items-start justify-center">
												<span>Samsung Galaxy S23 Ultra-Đen</span>
												<span>{moneyFormat.format(data.price)}</span>
											</div>

											<div className="flex items-center justify-center gap-2">
												<Input
													type="number"
													placeholder="1"
													className="w-16"
													labelPlacement="outside"
													size="sm"
													min="1"
												/>
												<Button size="sm" color="danger" isIconOnly startContent={<Trash size="15" />} />
											</div>
										</Card>
									</div>
								);
							})}
					</div>
				</div>
			)}
		</main>
	);
}
