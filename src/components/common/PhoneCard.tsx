"use client";

import { api } from "@/utils/trpc/react";

import Link from "next/link";

import { useUser } from "@clerk/nextjs";
import {
	Button,
	ButtonGroup,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tooltip,
	useDisclosure,
} from "@nextui-org/react";
import type { SanPhamBienThe, SanPhamMau } from "@prisma/client";

import { AlertTriangle, Heart, LogIn, ShoppingCart, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

type ParamsType = { sanPhamMau: SanPhamMau & { SanPhamBienThe: SanPhamBienThe[] } };

export const PhoneCard = ({ sanPhamMau }: ParamsType) => {
	const {
		data,
		isLoading,
		refetch: refetchYeuThich,
	} = api.sanPham.checkThichSP.useQuery(
		{ maSPM: sanPhamMau.MaSPM },
		{ refetchOnReconnect: false, refetchOnWindowFocus: false },
	);
	const yeuThich = api.sanPham.yeuThich.useMutation({
		onSuccess: async () => await refetchYeuThich(),
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	const moneyFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "vnd" });

	const { isLoaded, isSignedIn } = useUser();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const giaGoc = sanPhamMau.SanPhamBienThe.sort((a, b) => a.Gia - b.Gia)[0]!.Gia;

	return (
		<>
			<Card as={"div"} isHoverable isPressable shadow="lg" className="relative px-2 py-4">
				<Link href={"/phone/" + encodeURIComponent(sanPhamMau.TenSP)}>
					<CardHeader className="aspect-square overflow-visible p-0">
						<Image src={sanPhamMau.AnhBia} className="aspect-square w-full" />
					</CardHeader>

					<CardBody className="px-2 pb-0 pt-2">
						<h3>{sanPhamMau.TenSP}</h3>
					</CardBody>

					<CardFooter className="flex-col items-start px-2 pt-1">
						<span className="font-bold text-red-500">{moneyFormat.format(giaGoc)}</span>
						<p className="line-clamp-2 text-start text-sm">{sanPhamMau.MoTa}</p>
					</CardFooter>
				</Link>

				<ButtonGroup className="w-full">
					<Tooltip content="Thêm vào giỏ hàng" placement="bottom">
						<Button size="sm" className="w-full" startContent={<ShoppingCart size={16} />} />
					</Tooltip>

					<Tooltip content="Yêu thích sản phẩm" placement="bottom">
						<Button
							isLoading={!isLoaded || isLoading || yeuThich.isLoading}
							size="sm"
							className="w-full"
							startContent={
								!(!isLoaded || isLoading || yeuThich.isLoading) ? (
									<Heart size={16} className={data ? "fill-red-600 stroke-red-600" : ""} />
								) : undefined
							}
							onPress={() => {
								if (!isSignedIn) return onOpen();
								yeuThich.mutate({ maSPM: sanPhamMau.MaSPM });
							}}
						/>
					</Tooltip>
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
										href={"/auth/login"}
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
