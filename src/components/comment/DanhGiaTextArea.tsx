"use client";

import { api } from "@/utils/trpc/react";

import type { User as ClerkUser } from "@clerk/clerk-sdk-node";
import { Button, Input, Textarea, User } from "@nextui-org/react";

import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type ParamsType = { maSPM: string; maTraLoi?: string; user?: ClerkUser | null; refetch: () => Promise<unknown> };

export const DanhGiaTextArea = ({ maSPM, maTraLoi, user, refetch }: ParamsType) => {
	const [noiDung, setNoiDung] = useState("");

	const [tenKhachHang, setTenKH] = useState(
		user ? user.username ?? (user.lastName + " " + user.firstName).trim() : "",
	);

	const danhGia = api.danhGia.danhGiaBanTin.useMutation({
		onSuccess: async () => {
			setNoiDung("");
			setTenKH(user ? user.username ?? (user.lastName + " " + user.firstName).trim() : "");

			await refetch();
		},
		onError: ({ message }) => {
			toast.error("Lỗi: " + message);
		},
	});

	return (
		<div className="flex flex-col gap-2">
			{!user && (
				<Input
					isInvalid={danhGia.isError}
					label="Tên"
					placeholder="Nhập tên của bạn"
					variant="bordered"
					labelPlacement="outside"
					color={danhGia.isError ? "danger" : "primary"}
					value={tenKhachHang}
					onValueChange={setTenKH}
				/>
			)}

			<Textarea
				isInvalid={danhGia.isError}
				label="Đánh giá"
				variant="bordered"
				labelPlacement="outside"
				color={danhGia.isError ? "danger" : "primary"}
				placeholder="Viết cảm nhận của bạn về sản phẩm này"
				errorMessage={danhGia.isError ? danhGia.error.message : undefined}
				value={noiDung}
				onValueChange={setNoiDung}
				onKeyDown={(e) => {
					if (e.ctrlKey && e.key === "Enter") {
						danhGia.mutate({ maSPM, noiDung, maKhachHang: user?.id, maTraLoi, soSao: 5, tenKhachHang });
					}
				}}
			/>

			<div className="flex w-full items-center justify-between gap-4">
				{user && <User name={user.username} avatarProps={{ src: user.imageUrl }} />}

				<Button
					isIconOnly
					isLoading={danhGia.isLoading}
					endContent={danhGia.isLoading ? undefined : <SendHorizontal size={20} />}
					color="primary"
					onClick={() => {
						danhGia.mutate({ maSPM, noiDung, maKhachHang: user?.id, maTraLoi, soSao: 5, tenKhachHang });
					}}
				/>
			</div>
		</div>
	);
};
