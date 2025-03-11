"use client";

import { moneyFormat, sortStorage } from "@/utils/common";
import { api } from "@/utils/trpc/react";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { AddToCart } from "./add-to-card-btn";

import Image from "next/image";
import Link from "next/link";

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import type { MatHang, SanPhamBienThe, SanPhamMau } from "@prisma/client";

import { AlertTriangle, Heart, LoaderIcon, LogIn, UserPlus } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

type ParamsType = {
	sanPhamMau: SanPhamMau & {
		SanPhamBienThe: (SanPhamBienThe & { MatHang: MatHang | null })[];
		SanPhamYeuThich?: { MaSPM: string }[];
	};
	isSignedIn?: boolean;
};

export function PhoneCard({ sanPhamMau, isSignedIn }: ParamsType) {
	const model = useDisclosure();

	const { data, isFetching, refetch } = api.product.checkThichSP.useQuery(
		{ maSPM: sanPhamMau.MaSPM },
		{ refetchOnWindowFocus: false, initialData: !!sanPhamMau.SanPhamYeuThich?.length, enabled: false },
	);

	const yeuThich = api.product.yeuThich.useMutation({
		onSuccess: async () => await refetch(),
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	const defaultProduct = useMemo(() => {
		return sanPhamMau.SanPhamBienThe.sort((a, b) => sortStorage(a.DungLuong, b.DungLuong)).find(
			({ MatHang }) => (MatHang?.TonKho ?? 0) > 0,
		)!;
	}, [sanPhamMau.SanPhamBienThe]);

	return (
		<>
			<Card className="group flex flex-col rounded shadow-lg transition-colors hover:bg-card-foreground/5">
				<Link href={"/phone/" + encodeURIComponent(sanPhamMau.TenSP)} className="flex flex-1 flex-col">
					<CardHeader className="p-3">
						<div className="relative aspect-square w-full overflow-hidden rounded">
							<Image
								fill
								unoptimized
								alt={sanPhamMau.MoTa}
								src={sanPhamMau.AnhBia}
								className="object-cover"
							/>
						</div>
					</CardHeader>

					<CardContent className="flex-1 p-3 pt-0">
						<h3 className="line-clamp-1" title={sanPhamMau.TenSP}>
							{sanPhamMau.TenSP}
						</h3>

						<span className="font-bold text-red-500">{moneyFormat.format(defaultProduct.Gia)}</span>
						<p className="line-clamp-2 text-start text-sm">{sanPhamMau.MoTa}</p>
					</CardContent>
				</Link>

				<CardFooter className="p-3 pt-0">
					<AddToCart data={defaultProduct} productName={sanPhamMau.TenSP} />

					<Button
						title={isSignedIn ? "Yêu thích sản phẩm" : "Đăng nhập để yêu thích sản phẩm"}
						variant="outline"
						className="w-full rounded-l-none"
						disabled={!isSignedIn}
						onMouseDown={() => {
							if (!isSignedIn) return model.onOpen();
							yeuThich.mutate({ maSPM: sanPhamMau.MaSPM, isFavored: data ?? false });
						}}
					>
						{yeuThich.isPending || isFetching ? (
							<LoaderIcon size={16} className="animate-spin" />
						) : (
							<Heart size={16} className={data && isSignedIn ? "fill-red-600 stroke-red-600" : ""} />
						)}
					</Button>
				</CardFooter>
			</Card>

			{model.isOpen && <SignInWarningModel model={model} />}
		</>
	);
}

function SignInWarningModel({ model }: { model: ReturnType<typeof useDisclosure> }) {
	return (
		<Modal isOpen={model.isOpen} onOpenChange={model.onOpenChange}>
			<ModalContent>
				<ModalHeader className="flex items-center gap-2 pb-2">
					<AlertTriangle /> Bạn chưa đăng nhập
				</ModalHeader>

				<ModalBody>Vui lòng đăng nhập tài khoản để yêu thích sản phẩm</ModalBody>
				<ModalFooter className="pt-2">
					<div className="flex w-full">
						<Button asChild variant="outline" className="w-full rounded-r-none" onMouseDown={model.onClose}>
							<Link href="/auth/register" className="flex items-center justify-center gap-2">
								<UserPlus size={20} />
								<span>Đăng kí tài khoảng</span>
							</Link>
						</Button>

						<Button asChild variant="outline" className="w-full rounded-l-none" onMouseDown={model.onClose}>
							<Link href="/auth/login" className="flex items-center justify-center gap-2">
								<LogIn size={20} />
								<span>Đăng Nhập</span>
							</Link>
						</Button>
					</div>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
