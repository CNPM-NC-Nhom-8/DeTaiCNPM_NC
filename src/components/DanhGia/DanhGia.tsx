"use client";

import type { RouterOutput } from "@/server/trpc/trpc";
import { dayjs } from "@/utils/dayjs";
import { trpc } from "@/utils/trpc/react";

import { DanhGiaTextArea } from "./DanhGiaTextArea";

import type { User } from "@clerk/clerk-sdk-node";
import { Avatar, Button, Card, CardBody, Spacer, Spinner } from "@nextui-org/react";

import { Flag, MessagesSquare, Reply, X } from "lucide-react";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";

type ParamsType = {
	SanPhamMau: RouterOutput["sanPham"]["getSanPham"];
	userJSON: string | null;
};

export const DanhGiaSanPham = ({ SanPhamMau, userJSON }: ParamsType) => {
	const user = userJSON ? (JSON.parse(userJSON) as User) : null;

	const [pageNum, setPage] = useState(1);

	const {
		data,
		isLoading,
		isSuccess,
		refetch: refetchDanhGia,
	} = trpc.danhGia.getDanhGia.useQuery(
		{ maSPM: SanPhamMau.MaSPM, pageNum: pageNum },
		{ refetchOnReconnect: false, refetchOnWindowFocus: false },
	);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center pt-4">
				<Spinner label="Loading..." color="primary" />
			</div>
		);
	}

	if (isSuccess && data.length === 0)
		return (
			<div className="flex flex-col gap-4 pt-4">
				<h3 className="text-2xl font-bold">Đánh Giá</h3>
				<div className="w-full">
					<div className="flex h-full items-center justify-center gap-5">
						<MessagesSquare strokeWidth={2} size={40} />
						<span className="text-xl">Hãy là người đầu tiên bình luận</span>
					</div>
				</div>

				<DanhGiaTextArea
					maSPM={SanPhamMau.MaSPM}
					user={user}
					refetch={async () => {
						await refetchDanhGia();
					}}
				/>
			</div>
		);

	return (
		<div className="flex flex-col gap-4 pt-4">
			<DanhGiaTextArea
				maSPM={SanPhamMau.MaSPM}
				user={user}
				refetch={async () => {
					await refetchDanhGia();
				}}
			/>

			<div className="flex flex-col gap-2">
				{isSuccess &&
					data.map((danhGia) => {
						return (
							<DanhGia
								key={SanPhamMau.MaSPM}
								danhGia={danhGia}
								user={user}
								isTraLoi={false}
								refetch={async () => {
									await refetchDanhGia();
								}}
							/>
						);
					})}
			</div>
		</div>
	);
};

type DanhGiaParams = {
	danhGia: RouterOutput["danhGia"]["getDanhGia"][number];
	refetch: () => Promise<void>;
	user: User | null;
	isTraLoi: boolean;
};

const DanhGia = ({ danhGia, refetch, user: clerkUser, isTraLoi }: DanhGiaParams) => {
	const [isClicked, setClicked] = useState(false);
	const [isExpanded, setExpanded] = useState(false);

	const trpcContext = trpc.useContext();

	const user = trpc.taiKhoan.getTaiKhoan.useQuery(undefined, {
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});
	const traLoi = trpc.danhGia.getTraLoi.useQuery(
		{ maDanhGia: danhGia.MaDanhGia },
		{ refetchOnReconnect: false, refetchOnWindowFocus: false },
	);

	const xoaDanhGia = trpc.danhGia.xoaDanhGia.useMutation({
		onSuccess: async () => {
			await Promise.allSettled([
				refetch(),
				traLoi.refetch(),
				trpcContext.danhGia.getTraLoi.refetch({ maDanhGia: danhGia.MaTraLoi ?? danhGia.MaDanhGia }),
			]);
		},
		onError: ({ message }) => {
			toast.error("Lỗi: " + message);
		},
	});

	return (
		<Card isDisabled={xoaDanhGia.isLoading} as={isTraLoi ? Fragment : "div"}>
			<CardBody as={"div"} className="relative isolate">
				{user.isSuccess && (user.data?.Role === "NhanVien" || user.data?.Role === "QuanTriVien") && (
					<Button
						size="sm"
						isIconOnly
						color="danger"
						isLoading={xoaDanhGia.isLoading}
						className="absolute right-2 top-2 z-20"
						startContent={xoaDanhGia.isLoading ? undefined : <X size={16} />}
						onClick={() => xoaDanhGia.mutate({ maDanhGia: danhGia.MaDanhGia })}
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
								onClick={() => setClicked((p) => !p)}
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
									user={clerkUser}
									maTraLoi={danhGia.MaDanhGia}
									refetch={async () => {
										await Promise.allSettled([
											refetch(),
											traLoi.refetch(),
											trpcContext.danhGia.getTraLoi.refetch({
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
									startContent={
										<Reply
											size={16}
											className={`transition-transform ${
												isExpanded ? "-rotate-90" : "-rotate-180"
											}`}
										/>
									}
									onClick={() => setExpanded((p) => !p)}
								>
									{danhGia._count.TraLoiBoi} trả lời
								</Button>

								{isExpanded && traLoi.isLoading && (
									<>
										<Spacer y={2} />
										<blockquote className="flex flex-col gap-4 border-l-2 border-default-500 pl-4">
											<Spinner color="primary" label="Loading..." />
										</blockquote>
									</>
								)}

								{isExpanded && traLoi.isSuccess && (
									<>
										<Spacer y={2} />
										<blockquote className="flex flex-col gap-4 border-l-2 border-default-500 pl-4">
											{traLoi.data?.map((traLoi) => {
												return (
													<DanhGia
														key={traLoi.MaDanhGia}
														danhGia={traLoi}
														user={clerkUser}
														isTraLoi={true}
														refetch={async () => {
															await refetch();
														}}
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
