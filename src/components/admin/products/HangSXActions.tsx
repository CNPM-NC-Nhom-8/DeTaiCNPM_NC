"use client";

import { cn } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	useDisclosure,
} from "@nextui-org/react";

import { Pencil, PlusCircle, Settings2, XCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const HangSXActions = ({
	refetch,
	HangSX,
}: {
	refetch: () => Promise<unknown>;
	HangSX: RouterOutputs["common"]["getHangSX"];
}) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	const [actionType, setActionType] = useState<"Add" | "Edit" | "Delete">();
	const [tenHangSX, setTenHangSX] = useState("");
	const [selectedMaLKH, setMaLKH] = useState<string>();

	const actionLoaiKH = api.admin.hangSXActions.useMutation({
		onSuccess: async () => {
			await refetch();
			onClose();

			setTenHangSX("");
			setMaLKH(undefined);
		},
		onError: ({ message }) => {
			toast.error("Lỗi: " + message);
		},
	});

	return (
		<>
			<Dropdown showArrow>
				<DropdownTrigger>
					<Button
						size="lg"
						isIconOnly
						startContent={<Settings2 />}
						className="rounded-l-none aria-[expanded=true]:scale-100"
					/>
				</DropdownTrigger>
				<DropdownMenu
					aria-label="LoaiKH Actions"
					onAction={(e) => {
						setActionType(e as typeof actionType);
						onOpen();
					}}
				>
					<DropdownSection showDivider title="Hành động">
						<DropdownItem key="Add" description="Thêm hãng sản xuất" startContent={<PlusCircle />}>
							Thêm
						</DropdownItem>

						<DropdownItem key="Edit" description="Chỉnh sửa tên 1 hãng sản xuất" startContent={<Pencil />}>
							Chỉnh sửa
						</DropdownItem>
					</DropdownSection>
					<DropdownSection title={"Vùng nguy hiểm"}>
						<DropdownItem
							key="Delete"
							className="text-danger"
							color="danger"
							description="Xóa 1 hãng sản xuất"
							startContent={<XCircle />}
						>
							Xóa
						</DropdownItem>
					</DropdownSection>
				</DropdownMenu>
			</Dropdown>

			{actionType && (
				<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
					<ModalContent>
						<form
							onSubmit={(e) => {
								e.preventDefault();

								if (actionType === "Add")
									actionLoaiKH.mutate({
										tenHangSX: tenHangSX,
										type: actionType,
									});
								else if (actionType === "Edit" && selectedMaLKH)
									actionLoaiKH.mutate({
										maHangSX: selectedMaLKH,
										tenHangSX: tenHangSX,
										type: actionType,
									});
								else if (actionType === "Delete" && selectedMaLKH)
									actionLoaiKH.mutate({
										maHangSX: selectedMaLKH,
										type: actionType,
									});
							}}
						>
							<ModalHeader className="flex flex-col gap-1">
								{actionType === "Add" && "Thêm hãng sản xuất"}
								{actionType === "Edit" && "Sửa tên hãng sản xuất"}
								{actionType === "Delete" && "Xóa hãng sản xuất"}
							</ModalHeader>

							<ModalBody>
								{actionType === "Add" && (
									<Input
										label="Tên Hãng sản xuất"
										labelPlacement="outside"
										placeholder="Tên hãng sản xuất mà bạn muốn tạo"
										isInvalid={actionLoaiKH.isError}
										errorMessage={actionLoaiKH.error?.message}
										value={tenHangSX}
										onValueChange={setTenHangSX}
									/>
								)}

								{actionType === "Edit" && (
									<>
										<Select
											items={HangSX}
											label="Hãng sản xuất"
											labelPlacement="outside"
											placeholder="Chọn hãng sản xuất bạn muốn sửa tên"
											onChange={(e) => setMaLKH(e.target.value)}
										>
											{(hangSX) => <SelectItem key={hangSX.MaHSX}>{hangSX.TenHSX}</SelectItem>}
										</Select>

										<Input
											label="Tên Hãng sản xuất"
											labelPlacement="outside"
											placeholder="Tên mới cho hãng sản xuất"
											isInvalid={actionLoaiKH.isError}
											errorMessage={actionLoaiKH.error?.message}
											value={tenHangSX}
											onValueChange={setTenHangSX}
										/>
									</>
								)}

								{actionType === "Delete" && (
									<>
										<p>
											<span className="text-xl text-danger-600">Lưu ý:</span> Đây là 1 hành động
											không để đảo ngược, vui lòng xem xét kỹ trước khi xác nhận xóa!
										</p>

										<Select
											items={HangSX}
											label="Hãng sản xuất"
											labelPlacement="outside"
											placeholder="Chọn hãng sản xuất bạn muốn sửa xóa"
											onChange={(e) => setMaLKH(e.target.value)}
										>
											{(hangSX) => <SelectItem key={hangSX.MaHSX}>{hangSX.TenHSX}</SelectItem>}
										</Select>
									</>
								)}
							</ModalBody>

							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Đóng
								</Button>

								<Button
									type="submit"
									isLoading={actionLoaiKH.isLoading}
									color={cn<"primary" | "warning" | "danger">({
										danger: actionType === "Delete",
										warning: actionType === "Edit",
										primary: actionType === "Add",
									})}
								>
									{actionType === "Add" && "Thêm"}
									{actionType === "Edit" && "Sửa"}
									{actionType === "Delete" && "Xóa"}
								</Button>
							</ModalFooter>
						</form>
					</ModalContent>
				</Modal>
			)}
		</>
	);
};
