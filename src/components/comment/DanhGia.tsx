"use client";

import { cn, dayjs } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import { DanhGiaTextArea } from "./DanhGiaTextArea";

import { Avatar, Button, Card, CardBody, Spacer, Spinner } from "@nextui-org/react";

import { Flag, MessagesSquare, Reply, X } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import toast from "react-hot-toast";

type ParamsType = {
	sanPham: RouterOutputs["product"]["getSanPham"];
	user: RouterOutputs["common"]["getCurrentUser"];
};

export const DanhGiaSanPham = ({ sanPham, user }: ParamsType) => {
	const [limit, setLimit] = useState(5);

	const {
		data,
		isLoading,
		isSuccess,
		hasNextPage,
		refetch: refetchDanhGia,
	} = api.danhGia.getDanhGia.useInfiniteQuery(
		{ maSPM: sanPham.MaSPM, limit: limit },
		{ refetchOnReconnect: false, refetchOnWindowFocus: false, getNextPageParam: (lastPage) => lastPage.nextCursor },
	);

	const getDanhGiaFromData = useMemo(() => {
		if (!isSuccess) return [];

		return data.pages.map(({ danhGia }) => danhGia).flat();
	}, [data, isSuccess]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center pt-4">
				<Spinner label="Đang tải..." color="primary" />
			</div>
		);
	}

	if (!isSuccess) return;
	if (getDanhGiaFromData.length === 0)
		return (
			<div className="flex flex-col gap-4 pt-4">
				<h3 className="text-2xl font-bold">Đánh Giá</h3>
				<div className="w-full">
					<div className="flex h-full items-center justify-center gap-5">
						<MessagesSquare strokeWidth={2} size={40} />
						<span className="text-xl">Hãy là người đầu tiên bình luận</span>
					</div>
				</div>

				<DanhGiaTextArea maSPM={sanPham.MaSPM} user={user} refetch={async () => await refetchDanhGia()} />
			</div>
		);

	return (
		<div className="flex flex-col gap-4 pt-4">
			<DanhGiaTextArea maSPM={sanPham.MaSPM} user={user} refetch={async () => await refetchDanhGia()} />

			<div className="flex flex-col gap-2">
				{getDanhGiaFromData.map((danhGia) => {
					return (
						<DanhGia
							key={sanPham.MaSPM}
							danhGia={danhGia}
							user={user}
							isTraLoi={false}
							refetch={async () => await refetchDanhGia()}
						/>
					);
				})}
			</div>

			{hasNextPage && <Button onPress={() => setLimit((prev) => prev + 5)}> Tải thêm </Button>}
		</div>
	);
};

type DanhGiaParams = {
	danhGia: RouterOutputs["danhGia"]["getDanhGia"]["danhGia"][number];
	user: RouterOutputs["common"]["getCurrentUser"];
	refetch: () => Promise<unknown>;
	isTraLoi: boolean;
};

const DanhGia = ({ danhGia, refetch, user, isTraLoi }: DanhGiaParams) => {
	const [isClicked, setClicked] = useState(false);
	const [isExpanded, setExpanded] = useState(false);

	const apiUtils = api.useUtils();

	const traLoi = api.danhGia.getTraLoi.useQuery(
		{ maDanhGia: danhGia.MaDanhGia },
		{ refetchOnReconnect: false, refetchOnWindowFocus: false },
	);

	const xoaDanhGia = api.danhGia.deleteDanhGia.useMutation({
		onSuccess: async () => {
			await Promise.allSettled([
				refetch(),
				traLoi.refetch(),
				apiUtils.danhGia.getTraLoi.refetch({ maDanhGia: danhGia.MaTraLoi ?? danhGia.MaDanhGia }),
			]);
		},
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	return (
		<Card isDisabled={xoaDanhGia.isLoading} as={isTraLoi ? Fragment : "div"}>
			<CardBody as={"div"} className={cn("relative", { "p-0": isTraLoi })}>
				{user && (user.Role === "NhanVien" || user.Role === "QuanTriVien") && (
					<Button
						size="sm"
						isIconOnly
						color="danger"
						isLoading={xoaDanhGia.isLoading}
						className={cn("absolute right-2 top-2 z-20", { "right-0": isTraLoi })}
						startContent={xoaDanhGia.isLoading ? undefined : <X size={16} />}
						onPress={() => xoaDanhGia.mutate({ maDanhGia: danhGia.MaDanhGia })}
					/>
				)}

				<div className="grid grid-cols-[max-content,1fr] gap-x-4">
					<Avatar
						showFallback
						src={danhGia.KhachHang?.TaiKhoan.AnhDaiDien}
						className="row-[span_7_/_span_7]"
					/>

					<div className="flex flex-col gap-1">
						<span className="w-max capitalize"> {danhGia.TenKhachHang} </span>
						<p className="text-sm">{danhGia.NoiDungDG}</p>
					</div>

					<Spacer y={2} />

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Button
								startContent={<Reply size={16} />}
								size="sm"
								variant="bordered"
								onPress={() => setClicked((p) => !p)}
							>
								Trả lời
							</Button>

							<Button
								size="sm"
								isIconOnly
								color="danger"
								variant="bordered"
								startContent={<Flag size={16} />}
								title="Báo cáo đánh giá vi phạm"
							/>
						</div>
						<span className="text-sm">{dayjs(danhGia.NgayDanhGia).fromNow()}</span>
					</div>

					{isClicked && (
						<>
							<Spacer y={2} />

							<div>
								<DanhGiaTextArea
									maSPM={danhGia.MaSPM}
									user={user}
									maTraLoi={danhGia.MaDanhGia}
									refetch={async () => {
										await Promise.allSettled([
											refetch(),
											traLoi.refetch(),
											apiUtils.danhGia.getTraLoi.refetch({
												maDanhGia: danhGia.MaTraLoi ?? danhGia.MaDanhGia,
											}),
										]);

										setClicked(false);
									}}
								/>
							</div>
						</>
					)}

					{danhGia._count.TraLoiBoi > 0 && (
						<>
							<Spacer y={2} />

							<div>
								<Button
									variant="light"
									size="sm"
									onPress={() => setExpanded((p) => !p)}
									startContent={
										<Reply
											size={16}
											className={cn("-rotate-180 transition-transform", {
												"-rotate-90": isExpanded,
											})}
										/>
									}
								>
									{danhGia._count.TraLoiBoi} trả lời
								</Button>

								{isExpanded && traLoi.isLoading && (
									<>
										<Spacer y={2} />
										<blockquote className="flex flex-col gap-4 border-l-2 border-default-500 pl-4">
											<Spinner color="primary" label="Đang tải..." />
										</blockquote>
									</>
								)}

								{isExpanded && traLoi.isSuccess && (
									<>
										<Spacer y={2} />
										<blockquote className="flex flex-col gap-4 border-l-2 border-default-500 pl-4">
											{traLoi.data.map((traLoi) => {
												return (
													<DanhGia
														key={traLoi.MaDanhGia}
														danhGia={traLoi}
														user={user}
														isTraLoi={true}
														refetch={async () => await refetch()}
													/>
												);
											})}
										</blockquote>
									</>
								)}
							</div>
						</>
					)}
				</div>
			</CardBody>
		</Card>
	);
};
