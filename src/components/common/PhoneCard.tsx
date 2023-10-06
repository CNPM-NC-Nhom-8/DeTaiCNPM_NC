"use client";

import { useUser } from "@clerk/nextjs";

import { Card, CardHeader, CardBody, CardFooter, Image, Chip, Button, ButtonGroup } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";

import { AlertTriangle, Heart, LogIn, Plus, ShoppingCart, UserPlus } from "lucide-react";
import Link from "next/link";

const data = {
	image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/g/a/galaxys23ultra_front_green_221122_2.jpg",
	name: "Samsung Galaxy S23 Ultra 256GB",
	description: "Nhận ngay ưu đãi YouTube Premium dành cho chủ sở hữu Samsung Galaxy và 2 km khác",
	stars: 5,
	price: 21_790_000,
	isFavored: false,
	sales: 32,
};

export const PhoneCard = () => {
	const moneyFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "vnd" });
	const { isLoaded, isSignedIn } = useUser();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return (
		<>
			<Card isHoverable isPressable shadow="sm" className="relative px-2 py-4">
				{typeof data.sales === "number" && (
					<Chip className="absolute right-2 top-2 z-50" color="danger">
						Giảm {data.sales}%
					</Chip>
				)}

				<Link href={"/phone/" + data.name}>
					<CardHeader className="overflow-visible p-0">
						<Image shadow="sm" width="100%" src={data.image} />
					</CardHeader>

					<CardBody className="px-2 pb-0 pt-2">
						<h3>{data.name}</h3>
					</CardBody>

					<CardFooter className="flex-col items-start px-2 pt-1">
						<span className="font-bold text-red-500">{moneyFormat.format(data.price)}</span>
						<p className="line-clamp-2 text-sm">{data.description}</p>
					</CardFooter>
				</Link>

				<ButtonGroup>
					<Button size="sm" endContent={<ShoppingCart />} onClick={() => {}}>
						Thêm vào
					</Button>

					<Button
						size="sm"
						startContent={<Heart />}
						onClick={() => {
							if (!isLoaded || !isSignedIn) {
								onOpen();
							}
						}}
					>
						Yêu thích
					</Button>
				</ButtonGroup>
			</Card>

			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex items-center gap-2 pb-2">
								<AlertTriangle /> Bạn chưa đăng nhập
							</ModalHeader>
							<ModalBody>Vui lòng đăng nhập tài khoản để yêu thích sản phẩm</ModalBody>
							<ModalFooter className="pt-2">
								<ButtonGroup className="w-full">
									<Button
										className="w-full"
										as={Link}
										href="/auth/register"
										onClick={onClose}
										startContent={<UserPlus size={20} />}
									>
										Đăng kí tài khoảng
									</Button>
									<Button
										className="w-full"
										color="primary"
										as={Link}
										href="/auth/login"
										onClick={onClose}
										startContent={<LogIn size={20} />}
									>
										Đăng Nhập
									</Button>
								</ButtonGroup>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};
