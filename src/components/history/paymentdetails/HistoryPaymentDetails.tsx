import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

export const HistoryPaymentDetails = () => {
	return (
		<Card>
			<h1 className="mb-4 text-lg px-5 pt-5">Danh sách sản phẩm</h1>
			<CardBody className="max-h-[400px] border-solid border-b-2 overflow-auto overscroll-y-auto">
				<section className="py-4">
					<div className="flex">
						<Image
							width={300}
							alt="Hình ảnh sản phẩm"
							src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
						></Image>

						<div className="w-full px-5">
							<h2 className="mb-5 text-lg font-semibold">Tên sản phẩm</h2>

							<div className="flex justify-between">
								<div>
									<span>x1</span>
								</div>
								<div>
									<span>100.000</span>
								</div>
							</div>
						</div>
					</div>
				</section>
                <section className="py-4">
					<div className="flex">
						<Image
							width={300}
							alt="Hình ảnh sản phẩm"
							src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
						></Image>

						<div className="w-full px-5">
							<h2 className="mb-5 text-lg font-semibold">Tên sản phẩm</h2>

							<div className="flex justify-between">
								<div>
									<span>x1</span>
								</div>
								<div>
									<span>100.000</span>
								</div>
							</div>
						</div>
					</div>
				</section>
                <section className="py-4">
					<div className="flex">
						<Image
							width={300}
							alt="Hình ảnh sản phẩm"
							src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
						></Image>

						<div className="w-full px-5">
							<h2 className="mb-5 text-lg font-semibold">Tên sản phẩm</h2>

							<div className="flex justify-between">
								<div>
									<span>x1</span>
								</div>
								<div>
									<span>100.000</span>
								</div>
							</div>
						</div>
					</div>
				</section>
			</CardBody>

			<CardFooter>
				<div className="w-full">
					<div className="py-4 flex items-end justify-end">
						<p className="mr-2">Ngày đặt:</p>
						<p className="text-l">15/11/2023</p>
					</div>

					<div className="py-4 flex items-end justify-end">
						<p className="mr-2">Tổng số tiền:</p>
						<p className="text-3xl">1.000.000đ</p>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
};
