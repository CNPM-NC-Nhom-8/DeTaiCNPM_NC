"use client";

import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/react";

import { Button, Input, Textarea, User } from "@nextui-org/react";

import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type ParamsType = {
	maSPM: string;
	maTraLoi?: string;
	user: RouterOutputs["common"]["getCurrentUser"];
	refetch: () => Promise<unknown>;
};

export const DanhGiaTextArea = ({ maSPM, maTraLoi, user, refetch }: ParamsType) => {
	const [noiDung, setNoiDung] = useState("");
	const [tenKhachHang, setTenKH] = useState(user ? (user.TenTaiKhoan ?? (user.Ho + " " + user.Ten).trim()) : "");

	const danhGia = api.danhGia.danhGiaBanTin.useMutation({
		onSuccess: async () => {
			setNoiDung("");
			setTenKH(user ? (user.TenTaiKhoan ?? (user.Ho + " " + user.Ten).trim()) : "");

			await refetch();
		},
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	return (
		<div className="flex flex-col gap-2">
			{!user && (
				<Input
					variant="bordered"
					label="Tên"
					labelPlacement="outside"
					value={tenKhachHang}
					onValueChange={setTenKH}
					isInvalid={danhGia.isError}
					placeholder="Nhập tên của bạn"
					color={danhGia.isError ? "danger" : "primary"}
				/>
			)}

			<Textarea
				isInvalid={danhGia.isError}
				label="Đánh giá"
				variant="bordered"
				labelPlacement="outside"
				color={danhGia.isError ? "danger" : "primary"}
				classNames={{ helperWrapper: "right-0" }}
				placeholder="Viết cảm nhận của bạn về sản phẩm này"
				errorMessage={danhGia.isError ? danhGia.error.message : undefined}
				description={<span>{noiDung.length} ký tự</span>}
				value={noiDung}
				onValueChange={setNoiDung}
				onKeyDown={(e) => {
					if (e.ctrlKey && e.key === "Enter") {
						danhGia.mutate({
							maSPM,
							noiDung,
							maKhachHang: user?.MaTaiKhoan,
							maTraLoi,
							soSao: 5,
							tenKhachHang,
						});
					}
				}}
			/>

			<div className="flex w-full items-center justify-between gap-4">
				{user && <User name={user.TenTaiKhoan} avatarProps={{ src: user.AnhDaiDien }} />}

				<Button
					isIconOnly
					isLoading={danhGia.isPending}
					endContent={danhGia.isPending ? undefined : <SendHorizontal size={20} />}
					color="primary"
					onClick={() => {
						danhGia.mutate({
							maSPM,
							noiDung,
							maKhachHang: user?.MaTaiKhoan,
							maTraLoi,
							soSao: 5,
							tenKhachHang,
						});
					}}
				/>
			</div>
		</div>
	);
};
