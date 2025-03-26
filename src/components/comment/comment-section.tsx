"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { cn, dayjs } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/react";

import { CommentTextarea } from "./comment-textarea";

import { Flag, MessagesSquare, Reply, X } from "lucide-react";
import { use, useMemo, useState } from "react";
import { toast } from "sonner";

type ParamsType = {
	sanPham: RouterOutputs["product"]["getSanPham"];
	userPromise: Promise<RouterOutputs["common"]["getCurrentUser"] | null>;
};

export function CommentSection({ sanPham, userPromise }: ParamsType) {
	const user = use(userPromise);

	const [limit, setLimit] = useState(5);
	const [data, { hasNextPage, refetch }] = api.comment.getDanhGia.useSuspenseInfiniteQuery(
		{ maSPM: sanPham.MaSPM, limit: limit },
		{ getNextPageParam: (lastPage) => lastPage.nextCursor },
	);

	const comments = useMemo(() => data.pages.flatMap(({ danhGia }) => danhGia), [data]);

	if (comments.length === 0)
		return (
			<div className="flex flex-col gap-4 pt-4">
				<h3 className="text-2xl font-bold">Đánh Giá</h3>

				<div className="w-full">
					<div className="flex h-full items-center justify-center gap-5">
						<MessagesSquare strokeWidth={2} size={40} />
						<span className="text-xl">Hãy là người đầu tiên bình luận</span>
					</div>
				</div>

				<CommentTextarea maSPM={sanPham.MaSPM} />
			</div>
		);

	return (
		<div className="flex flex-col gap-4 pt-4">
			<h3 className="text-2xl font-bold">Đánh Giá</h3>
			<CommentTextarea maSPM={sanPham.MaSPM} />

			<div className="flex flex-col gap-2">
				{comments.map((comment) => (
					<DanhGia key={comment.MaDanhGia} comment={comment} user={user} refetch={refetch} />
				))}
			</div>

			{hasNextPage && <Button onMouseDown={() => setLimit((prev) => prev + 5)}>Tải thêm</Button>}
		</div>
	);
}

type DeleteButtonProps = {
	user: RouterOutputs["common"]["getCurrentUser"] | null;
	comment: RouterOutputs["comment"]["getDanhGia"]["danhGia"][number];
	refetch: () => Promise<unknown>;
};

function DeleteButton({ user, comment, refetch }: DeleteButtonProps) {
	const apiUtils = api.useUtils();

	const xoaDanhGia = api.comment.deleteDanhGia.useMutation({
		onSuccess: async () => {
			await Promise.allSettled([
				refetch(),
				// apiUtils.danhGia.getTraLoi.refetch({ maDanhGia: comment.MaTraLoi ?? comment.MaDanhGia }),
			]);
		},
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	if (!user || user.Role === "KhachHang") return null;

	return (
		<Button
			variant="destructive"
			disabled={xoaDanhGia.isPending}
			className="absolute right-3 top-3 z-20 size-8"
			onMouseDown={() => xoaDanhGia.mutate({ maDanhGia: comment.MaDanhGia })}
		>
			{xoaDanhGia.isPending ? undefined : <X size={16} />}
		</Button>
	);
}

type DanhGiaParams = {
	comment: RouterOutputs["comment"]["getDanhGia"]["danhGia"][number];
	user: RouterOutputs["common"]["getCurrentUser"] | null;
	refetch: () => Promise<unknown>;
	isReplied?: boolean;
};

function DanhGia({ comment, refetch, user, isReplied = false }: DanhGiaParams) {
	const [isReplying, setReplying] = useState(false);
	const [isOpenReplies, setOpenReplies] = useState(false);

	// const traLoi = api.danhGia.getTraLoi.useQuery(
	// 	{ maDanhGia: comment.MaDanhGia },
	// 	{ refetchOnReconnect: false, refetchOnWindowFocus: false },
	// );

	return (
		<Card>
			<CardContent className="relative p-3">
				<DeleteButton user={user} comment={comment} refetch={refetch} />

				<div className="grid grid-cols-[max-content,1fr] gap-x-4">
					<Avatar>
						<AvatarImage
							src={comment.TenKhachHang === null ? undefined : comment.KhachHang?.TaiKhoan.AnhDaiDien}
						/>
						<AvatarFallback>{comment.TenKhachHang?.[0] ?? "A"}</AvatarFallback>
					</Avatar>

					<div className="flex flex-col gap-1">
						<span className="font-semibold capitalize"> {comment.TenKhachHang ?? "Ẩn danh"} </span>
						<p className="text-sm">{comment.NoiDungDG}</p>
					</div>
				</div>
			</CardContent>
		</Card>

		// <Card isDisabled={xoaDanhGia.isPending} as={isTraLoi ? Fragment : "div"}>
		// 	<CardContent className={cn("relative", { "p-0": isTraLoi })}>
		// 		{user && (user.Role === "NhanVien" || user.Role === "QuanTriVien") && (
		// 			<Button
		// 				size="sm"
		// 				isIconOnly
		// 				color="danger"
		// 				isLoading={xoaDanhGia.isPending}
		// 				className={cn("absolute right-2 top-2 z-20", { "right-0": isTraLoi })}
		// 				startContent={xoaDanhGia.isPending ? undefined : <X size={16} />}
		// 				onPress={() => xoaDanhGia.mutate({ maDanhGia: danhGia.MaDanhGia })}
		// 			/>
		// 		)}

		// 		<div className="grid grid-cols-[max-content,1fr] gap-x-4">
		// 			<Avatar
		// 				showFallback
		// 				src={danhGia.KhachHang?.TaiKhoan.AnhDaiDien}
		// 				className="row-[span_7_/_span_7]"
		// 			/>

		// 			<div className="flex flex-col gap-1">
		// 				<span className="w-max capitalize"> {danhGia.TenKhachHang} </span>
		// 				<p className="text-sm">{danhGia.NoiDungDG}</p>
		// 			</div>

		// 			<Spacer y={2} />

		// 			<div className="flex items-center justify-between">
		// 				<div className="flex items-center gap-2">
		// 					<Button
		// 						startContent={<Reply size={16} />}
		// 						size="sm"
		// 						variant="bordered"
		// 						onPress={() => setClicked((p) => !p)}
		// 					>
		// 						Trả lời
		// 					</Button>

		// 					<Button
		// 						size="sm"
		// 						isIconOnly
		// 						color="danger"
		// 						variant="bordered"
		// 						startContent={<Flag size={16} />}
		// 						title="Báo cáo đánh giá vi phạm"
		// 					/>
		// 				</div>
		// 				<span className="text-sm">{dayjs(danhGia.NgayDanhGia).fromNow()}</span>
		// 			</div>

		// 			{isClicked && (
		// 				<div>
		// 					<DanhGiaTextArea
		// 						maSPM={danhGia.MaSPM}
		// 						user={user}
		// 						maTraLoi={danhGia.MaDanhGia}
		// 						refetch={async () => {
		// 							await Promise.allSettled([
		// 								refetch(),
		// 								traLoi.refetch(),
		// 								apiUtils.danhGia.getTraLoi.refetch({
		// 									maDanhGia: danhGia.MaTraLoi ?? danhGia.MaDanhGia,
		// 								}),
		// 							]);

		// 							setClicked(false);
		// 						}}
		// 					/>
		// 				</div>
		// 			)}

		// 			{danhGia._count.TraLoiBoi > 0 && (
		// 				<div>
		// 					<Button
		// 						variant="light"
		// 						size="sm"
		// 						onPress={() => setExpanded((p) => !p)}
		// 						startContent={
		// 							<Reply
		// 								size={16}
		// 								className={cn("-rotate-180 transition-transform", {
		// 									"-rotate-90": isExpanded,
		// 								})}
		// 							/>
		// 						}
		// 					>
		// 						{danhGia._count.TraLoiBoi} trả lời
		// 					</Button>

		// 					{isExpanded && traLoi.isPending && (
		// 						<blockquote className="flex flex-col gap-4 border-l-2 border-default-500 pl-4">
		// 							<Spinner color="primary" label="Đang tải..." />
		// 						</blockquote>
		// 					)}

		// 					{isExpanded && traLoi.isSuccess && (
		// 						<blockquote className="flex flex-col gap-4 border-l-2 border-default-500 pl-4">
		// 							{traLoi.data.map((traLoi) => {
		// 								return (
		// 									<DanhGia
		// 										key={traLoi.MaDanhGia}
		// 										danhGia={traLoi}
		// 										user={user}
		// 										isTraLoi={true}
		// 										refetch={async () => await refetch()}
		// 									/>
		// 								);
		// 							})}
		// 						</blockquote>
		// 					)}
		// 				</div>
		// 			)}
		// 		</div>
		// 	</CardContent>
		// </Card>
	);
}
