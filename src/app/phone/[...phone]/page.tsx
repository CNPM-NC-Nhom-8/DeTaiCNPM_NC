"use client";

import {
	Accordion,
	AccordionItem,
	Badge,
	Button,
	ButtonGroup,
	Card,
	CardBody,
	CardHeader,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tabs,
	useDisclosure,
} from "@nextui-org/react";
import {
	CheckIcon,
	ChevronLeft,
	ChevronRight,
	CreditCard,
	DollarSign,
	Landmark,
	PackageOpen,
	ShieldCheck,
	ShoppingCart,
	Smartphone,
	X,
} from "lucide-react";
import { useState } from "react";
import { useAtom } from "jotai";

import { PhoneCard } from "@/components/common/PhoneCard";
import { Radio, RadioGroup } from "@nextui-org/react";
import { countAtom } from "@/server/jotai/cart";

const data = {
	image: [
		"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung_s23_ultra_-_1.png",
		"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung_s23_ultra_-_2.png",
		"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung_s23_ultra_-_3.png",
		"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung_s23_ultra_-_4.png",
		"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung_s23_ultra_-_6.png",
		"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung_s23_ultra_-_7.png",
		"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung_s23_ultra_-_8.png",
		"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung_s23_ultra_-_9.png",
		"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-xanh.png",
		"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-xanh-1.png",
		"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-xanh-2.png",
	],
	name: "Samsung Galaxy S23 Ultra 256GB",
	description: "Nhận ngay ưu đãi YouTube Premium dành cho chủ sở hữu Samsung Galaxy và 2 km khác",
	stars: 5,
	isFavored: false,
	sales: 32,
};

const size = [
	{
		size: "12GB - 1TB",
		price: 32_590_000,
	},
	{
		size: "12GB - 512GB",
		price: 25_590_000,
	},
	{
		size: "12GB - 256GB",
		price: 21_790_000,
	},
];

const colors = [
	{
		src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:50:50/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-tim_1.png",
		name: "Tím",
		price: 21_790_000,
	},
	{
		src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:50:50/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-xanh_1.png",
		name: "Xanh",
		price: 21_790_000,
	},
	{
		src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:50:50/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-den_1.png",
		name: "Đen",
		price: 21_790_000,
	},
	{
		src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:50:50/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/2/s23-ultra-kem_1.png",
		name: "Trắng",
		price: 21_790_000,
	},
];

const thongThiKyThuat = {
	"Kích thước màn hình": "6.8 inches",
	"Công nghệ màn hình": "Dynamic AMOLED 2X",
	"Camera sau":
		"Siêu rộng: 12MP F2.2 (Dual Pixel AF)\nChính: 200MP F1.7 OIS ±3° (Super Quad Pixel AF)\nTele 1: 10MP F4.9 (10X, Dual Pixel AF) OIS,\nTele 2: 10MP F2.4 (3X, Dual Pixel AF) OIS Thu phóng chuẩn không gian 100X",
	"Camera trước": "12MP F2.2 (Dual Pixel AF)",
	Chipset: "Snapdragon 8 Gen 2 (4 nm)",
	"Dung lượng RAM": "8 GB",
	"Bộ nhớ trong": "256 GB",
	Pin: "5.000mAh",
	"Thẻ SIM": "2 Nano SIM hoặc 1 Nano + 1 eSIM",
	"Hệ điều hành": "Android",
	"Độ phân giải màn hình": "1440 x 3088 pixels (QHD+)",
	"Tính năng màn hình": "120Hz, HDR10+, 1750 nits, Gorilla Glass Victus 2",
	"Tương thích": "Bút S-Pen",
};

export default function Page({ params: { phone: encodePhone } }: { params: { phone: string } }) {
	const moneyFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "vnd" });

	const [cardCount, setCardCount] = useAtom(countAtom);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [selectedSize, setSize] = useState(size[0].size);
	const [selectedColor, setColor] = useState(colors[0].name);

	const [currentImage, setImage] = useState(data.image[0]);

	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-6 px-6 py-4">
			<h3 className="text-xl font-bold">{data.name}</h3>

			<section className="flex gap-4">
				<div className="flex flex-col gap-4">
					<section className="flex flex-col overflow-hidden rounded-lg">
						<div className="group relative w-full">
							<Button
								isIconOnly
								startContent={<ChevronLeft />}
								className="absolute left-0 top-1/2 z-10 -translate-x-full rounded-l-none bg-black/60 transition-transform group-hover:translate-x-0"
								onClick={() => {
									setImage((prev) => {
										const currentIndex = data.image.indexOf(prev);
										return data.image.at(currentIndex - 1 < 0 ? -1 : currentIndex - 1)!;
									});
								}}
							/>

							<div
								className="flex w-full transition-all"
								style={{ translate: -Math.abs(data.image.indexOf(currentImage)) + "00%" }}
							>
								{data.image.map((item) => (
									<div key={item} className="flex min-w-full flex-shrink-0 flex-grow [&>div]:w-full [&>div]:!max-w-full">
										<Image
											src={item}
											key={item}
											className="aspect-video w-full flex-shrink-0 flex-grow rounded-b-none rounded-t-lg object-scale-down object-center"
										/>
									</div>
								))}
							</div>

							<Button
								isIconOnly
								startContent={<ChevronRight />}
								className="absolute right-0 top-1/2 z-10 translate-x-full rounded-r-none bg-black/60 transition-transform group-hover:translate-x-0"
								onClick={() => {
									setImage((prev) => {
										const currentIndex = data.image.indexOf(prev);
										return data.image.at(currentIndex + 1 >= data.image.length ? 0 : currentIndex + 1)!;
									});
								}}
							/>
						</div>

						<div className="flex w-full gap-4 overflow-x-scroll px-2 scrollbar-hide">
							{data.image.map((item) => (
								<Button
									key={item}
									radius="none"
									className="h-full min-w-max flex-col p-0 outline-none"
									onClick={() => setImage(item)}
								>
									<Image radius="none" src={item} className="aspect-square w-12 object-cover" />
								</Button>
							))}
						</div>
					</section>

					<section>
						<Card>
							<CardHeader>
								<h3 className="text-xl">Thông tin sản phẩm</h3>
							</CardHeader>
							<CardBody className="px-3 pb-3 pt-0">
								<ul className="flex flex-col gap-2">
									<li className="flex items-start gap-2">
										<Smartphone size={20} className="flex-shrink-0" /> <span>Mới, đầy đủ phụ kiện từ nhà sản xuất</span>
									</li>
									<li className="flex items-start gap-2">
										<PackageOpen size={20} className="flex-shrink-0" />
										<span> Máy, cáp, sách hướng dẫn, que chọc sim </span>
									</li>
									<li className="flex items-start gap-2">
										<ShieldCheck size={20} className="flex-shrink-0" />
										<span>
											Bảo hành 12 tháng tại trung tâm bảo hành Chính hãng. 1 đổi 1 trong 30 ngày nếu có lỗi phần cứng
											từ nhà sản xuất. (xem chi tiết)
										</span>
									</li>
									<li className="flex items-start gap-2">
										<Landmark size={20} className="flex-shrink-0" />
										<span> Giá sản phẩm đã bao gồm VAT </span>
									</li>
								</ul>
							</CardBody>
						</Card>
					</section>
				</div>

				<aside className="flex w-1/3 flex-shrink-0 flex-col gap-4">
					<section className="grid grid-cols-3 gap-4">
						{size.map((item, index) => {
							return (
								<Badge
									key={item.size + "-" + index}
									content={<CheckIcon size={16} />}
									isInvisible={selectedSize !== item.size}
									disableOutline
									className="bg-success-500 text-success-foreground"
								>
									<div className="contents" onClick={() => setSize(item.size)}>
										<Card
											key={item.size + index}
											className={`w-full cursor-pointer gap-1 border-2 border-transparent py-2 text-center text-sm ${
												selectedSize === item.size && "border-success-500"
											}`}
										>
											<span className="font-semibold">{item.size}</span>
											<span>{moneyFormat.format(item.price)}</span>
										</Card>
									</div>
								</Badge>
							);
						})}
					</section>

					<h4 className="font-semibold">Chọn màu để xem giá và chi nhánh có hàng</h4>

					<section className="grid grid-cols-3 gap-2">
						{colors.map((item, index) => {
							return (
								<Badge
									key={item.name + "-" + index}
									disableOutline
									content={<CheckIcon size={16} />}
									isInvisible={selectedColor !== item.name}
									className="bg-success-500 text-success-foreground"
								>
									<div className="contents" onClick={() => setColor(item.name)}>
										<Card
											key={item.name + index}
											className={`w-full cursor-pointer gap-2 border-2 border-transparent px-4 py-2 text-center text-sm ${
												selectedColor === item.name && "border-success-500"
											}`}
										>
											<div className="flex items-center gap-2">
												<Image src={item.src} radius="md" className="flex-shrink-0" />
												<span className="flex-grow font-semibold">{item.name}</span>
											</div>

											<span>{moneyFormat.format(item.price)}</span>
										</Card>
									</div>
								</Badge>
							);
						})}
					</section>

					<section className="flex flex-col gap-2">
						<ButtonGroup className="w-full">
							<Button color="success" size="lg" startContent={<DollarSign size={20} />} className="w-2/3 text-lg">
								Mua ngay
							</Button>
							<Button
								color="success"
								size="lg"
								endContent={<ShoppingCart size={20} />}
								variant="bordered"
								className="w-1/3 px-2"
								onClick={() => setCardCount((prev) => prev + 1)}
							>
								Thêm vào
							</Button>
						</ButtonGroup>

						<ButtonGroup className="w-full">
							<Button color="primary" size="lg" className="w-1/2 flex-col gap-0 text-sm font-semibold">
								Trả góp 0%
								<span className="font-normal">Trả góp chỉ từ 0%</span>
							</Button>
							<Button color="primary" size="lg" startContent={<CreditCard size={20} />} className="w-1/2 text-sm">
								Thêm góp qua thẻ <br /> (Visa, Mastercard)
							</Button>
						</ButtonGroup>
					</section>

					<section>
						<Card>
							<CardHeader className="gap-2">
								<ShieldCheck className="flex-shrink-0" /> Bảo vệ sản phẩm toàn diện với dịch vụ bảo hành mở rộng
							</CardHeader>
							<div className="px-3 pb-3">
								<RadioGroup className="gap-2">
									<Radio value="op-1" checked>
										<span className="text-sm">
											1 đổi 1 VIP 6 tháng: Đổi máy mới tương đương khi có lỗi từ NSX trong 6 tháng
										</span>
									</Radio>
									<Radio value="op-2">
										<span className="text-sm">
											S24+ 12 tháng: Đổi sản phẩm tương đương hoặc miễn phí chi phí sửa chữa nếu có lỗi của NSX khi
											hết hạn bảo hành trong 12 tháng
										</span>
									</Radio>
									<Radio value="op-3">
										<span className="text-sm">
											1 đổi 1 VIP 12 tháng: Đổi máy mới tương đương khi có lỗi từ NSX trong 12 tháng
										</span>
									</Radio>
									<Radio value="op-4">
										<span className="text-sm">
											Rơi vỡ - Rớt nước: Hỗ trợ 90% chi phí sửa chữa, đổi mới sản phẩm nếu hư hỏng nặng trong 12 tháng
										</span>
									</Radio>
								</RadioGroup>
							</div>
						</Card>
					</section>
				</aside>
			</section>

			<section className="flex w-full flex-col">
				<Tabs aria-label="Options">
					<Tab key="SimiarProduct" title="Sản phẩm tương tự">
						<section className="grid grid-cols-5 gap-4">
							{Array(5)
								.fill(0)
								.map((_, index) => {
									return <PhoneCard key={index} />;
								})}
						</section>
					</Tab>
					<Tab key="SecondHands" title="Tham khảo hàng cũ">
						<section className="grid grid-cols-5 gap-4">
							{Array(4)
								.fill(0)
								.map((_, index) => {
									return <PhoneCard key={index} />;
								})}
						</section>
					</Tab>
				</Tabs>
			</section>

			<section className="flex gap-4">
				<div className="flex flex-grow flex-col gap-4">
					<Card className="px-6 py-4">
						<h3 className="text-center text-2xl font-semibold">ĐẶC ĐIỂM NỔI BẬT</h3>

						<div className="flex flex-col gap-2">
							<p>
								Sau sự đổ bộ thành công của Samsung Galaxy S22 những chiếc điện thoại dòng Flagship tiếp theo -
								<b>Điện thoại Samsung Galaxy S23 Ultra</b> là đối tượng được Samfans hết mực săn đón. Kiểu dáng thanh lịch
								sang chảnh kết hợp với những bước đột phá trong công nghệ đã kiến tạo nên siêu phẩm Flagship nhà Samsung.
							</p>
							<h4 className="text-xl font-semibold">Điện thoại Samsung Galaxy S23 Ultra liệu có gì mới?</h4>
							<blockquote className="border-l-4 border-white pl-4">
								Samsung S23 Ultra là dòng điện thoại cao cấp của Samsung, sở hữu camera độ phân giải 200MP ấn tượng, chip
								Snapdragon 8 Gen 2 mạnh mẽ, bộ nhớ RAM 8GB mang lại hiệu suất xử lý vượt trội cùng khung viền vuông vức sang
								trọng. Sản phẩm được ra mắt từ đầu năm 2023.
							</blockquote>
							<h4 className="text-lg font-semibold">Thiết kế cao cấp, đường nét thời thượng, tinh tế</h4>
							<p>
								Tiếp nối thiết kế từ những chiếc Samsung Galaxy S22 Ultra, những chiếc <b>Samsung S23 Ultra</b> mang dáng vẻ
								thanh mảnh với những đường nét được gọt giũa chỉnh chu và cực kỳ tinh tế. Với màn hình tràn viền, tỷ lệ màn
								hình trên thân máy hơn 90% những chiếc điện thoại S23 Ultra hứa hẹn mang đến một thiết kế thời thượng thu
								hút mọi ánh nhìn.
							</p>
							<Image src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:80/plain/https://cellphones.com.vn/media/wysiwyg/Phone/Samsung/samsung_s/S23/samsung-galaxy-s23-ultra-4_1.jpg" />
							<p>
								Vẫn là mặt lưng nguyên khối cùng cụm camera không viền được đặt ở góc trái trên cùng logo Samsung quen thuộc
								nằm góc dưới mặt lưng tạo cảm giác đơn giản nhưng không kém phần nổi bật cho thiết kế. Thanh lịch nhưng đặc
								biệt có sức hút, đơn giản mà toát lên sự cao cấp, những chiếc Samsung S23 Ultra chắc chắn là sự lựa chọn
								hoàn hảo khi bình chọn những thiết kế đỉnh cao trong năm 2023.
							</p>
							<Image src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:80/plain/https://cellphones.com.vn/media/wysiwyg/Phone/Samsung/samsung_s/S23/samsung-galaxy-s23-ultra-2_2.jpg" />
						</div>
					</Card>

					<Card className="px-2">
						<CardHeader className="items-center justify-center text-xl">Các câu hỏi thường gặp</CardHeader>

						<Accordion>
							<AccordionItem key="1" title="Camera Galaxy S23 Ultra nâng cấp trải nghiệm chụp ảnh như thế nào?">
								Sở hữu 5 camera gồm: camera selfie 12MP, Camera góc siêu rộng 12MP, Camera góc rộng 200MP, camera tele 10MP
								tiên tiến và hiện đại. Ảnh selfie thiếu sáng được AI tăng cường để có chi tiết sắc nét và màu sắc chính xác
								hơn. Và ảnh chân dung vào ban đêm được xác định rõ ràng nhờ phân tích độ sâu được AI phát hiện.
							</AccordionItem>
							<AccordionItem key="2" title="Galaxy S23 Ultra có đi kèm bút S-Pen không?">
								Galaxy S23 Ultra đi kèm với bút S Pen và hỗ trợ nhiều tiện ích, nhờ bạn có thể ghi chú nhanh, đánh dấu và
								chỉnh sửa văn bản hay hình ảnh dưới dạng chữ viết tay hoặc phác thảo một cách thuận tiện.
							</AccordionItem>
							<AccordionItem key="3" title="Màn hình Galaxy S23 Ultra có những công nghệ gì nổi bật?">
								Màn hình thì Galaxy S23 Ultra sử dụng tấm nền Dynamic AMOLED 2X kèm kích thước 6.8 inch và tần số quét 120
								Hz, QHD+ (1400 x 3088 Pixels) nhờ đó đem lại khung hình điện ảnh rõ nét và sống động.
							</AccordionItem>
							<AccordionItem key="4" title="Galaxy S23 Ultra có những phiên bản màu sắc và bộ nhớ nào?">
								Galaxy S23 Ultra có các màu Xanh Botanic, Đen Phantom, Tím Lilac và Kem Cotton và có 3 tùy chọn dung lượng
								lưu trữ: 256GB, 512GB và 1TB.
							</AccordionItem>
							<AccordionItem key="5" title="Galaxy S23 Ultra có gì khác so với Galaxy S22 Ultra?">
								Điểm cải tiến lớn nhất ở Galaxy S23 Ultra là máy có camera độ phân giải cao nhất trên điện thoại thông minh
								Galaxy ở 200MP, so với 108MP của S22 Ultra. Cùng với đó, dù dung lượng pin như nhau là 5000mAh, nhưng Galaxy
								S23 Ultra cung cấp khả năng phát video lên đến khoảng 26 giờ và hiệu năng mạnh mẽ hơn.
							</AccordionItem>
						</Accordion>
					</Card>
				</div>

				<aside className="flex w-1/3 flex-shrink-0 flex-col gap-4">
					<div>
						<Card className="flex max-h-max flex-grow flex-col gap-2 p-3">
							<h3 className="px-2 text-xl font-semibold">Thông tin kỹ thuật</h3>

							<Table isStriped>
								<TableHeader>
									<TableColumn key={"Ten"}>Tên</TableColumn>
									<TableColumn key={"ThongTin"}>Thông tin</TableColumn>
								</TableHeader>
								<TableBody>
									{Object.keys(thongThiKyThuat).map((row) => {
										const key = row as keyof typeof thongThiKyThuat;
										const data = thongThiKyThuat[key];

										return (
											<TableRow key={key}>
												<TableCell>{key}</TableCell>
												<TableCell>{data}</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>

							<Button className="w-full" onClick={onOpen}>
								Xem Cấu Hình Chi Tiết
							</Button>

							<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
								<ModalContent>
									{(onClose) => (
										<>
											<ModalHeader className="flex flex-col gap-1">Thông Tin Kỹ Thuật</ModalHeader>
											<ModalBody>
												<Table isStriped>
													<TableHeader>
														<TableColumn key={"Ten"}>Tên</TableColumn>
														<TableColumn key={"ThongTin"}>Thông tin</TableColumn>
													</TableHeader>
													<TableBody>
														{Object.keys(thongThiKyThuat).map((row) => {
															const key = row as keyof typeof thongThiKyThuat;
															const data = thongThiKyThuat[key];

															return (
																<TableRow key={key}>
																	<TableCell>{key}</TableCell>
																	<TableCell>{data}</TableCell>
																</TableRow>
															);
														})}
													</TableBody>
												</Table>
											</ModalBody>
											<ModalFooter>
												<Button
													className="w-full text-lg"
													startContent={<X />}
													color="danger"
													variant="light"
													onPress={onClose}
												>
													Đóng
												</Button>
											</ModalFooter>
										</>
									)}
								</ModalContent>
							</Modal>
						</Card>
					</div>
				</aside>
			</section>
		</main>
	);
}
