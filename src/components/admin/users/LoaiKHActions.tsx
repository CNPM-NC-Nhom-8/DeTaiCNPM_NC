"use client";

import { cn } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/react";

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
import { toast } from "sonner";

export const LoaiKHActions = ({
	refetch,
	LoaiKH,
}: {
	refetch: () => Promise<unknown>;
	LoaiKH: RouterOutputs["common"]["getLoaiKH"];
}) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	const [actionType, setActionType] = useState<"Add" | "Edit" | "Delete">();
	const [tenLoaiKH, setTenLKH] = useState("");
	const [selectedMaLKH, setMaLKH] = useState<string>();

	const actionLoaiKH = api.admin.loaiKHActions.useMutation({
		onSuccess: async () => {
			await refetch();
			onClose();

			setTenLKH("");
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
						radius="lg"
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
						<DropdownItem key="Add" description="Thêm loại khách hàng" startContent={<PlusCircle />}>
							Thêm
						</DropdownItem>

						<DropdownItem
							key="Edit"
							description="Chỉnh sửa tên 1 loại khách hàng"
							startContent={<Pencil />}
						>
							Chỉnh sửa
						</DropdownItem>
					</DropdownSection>
					<DropdownSection title={"Vùng nguy hiểm"}>
						<DropdownItem
							key="Delete"
							className="text-danger"
							color="danger"
							description="Xóa 1 loại khách hàng"
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
										TenLoaiTV: tenLoaiKH,
										type: actionType,
									});
								else if (actionType === "Edit" && selectedMaLKH)
									actionLoaiKH.mutate({
										MaLoaiKH: selectedMaLKH,
										TenLoaiTV: tenLoaiKH,
										type: actionType,
									});
								else if (actionType === "Delete" && selectedMaLKH)
									actionLoaiKH.mutate({
										MaLoaiKH: selectedMaLKH,
										type: actionType,
									});
							}}
						>
							<ModalHeader className="flex flex-col gap-1">
								{actionType === "Add" && "Thêm loại khách hàng"}
								{actionType === "Edit" && "Sửa tên loại khách hàng"}
								{actionType === "Delete" && "Xóa loại khách hàng"}
							</ModalHeader>

							<ModalBody>
								{actionType === "Add" && (
									<Input
										label="Tên Loại khách hàng"
										labelPlacement="outside"
										placeholder="Tên loại khách hàng mà bạn muốn tạo"
										isInvalid={actionLoaiKH.isError}
										errorMessage={actionLoaiKH.error?.message}
										value={tenLoaiKH}
										onValueChange={setTenLKH}
									/>
								)}

								{actionType === "Edit" && (
									<>
										<Select
											items={LoaiKH}
											label="Loại khách hàng"
											labelPlacement="outside"
											placeholder="Chọn loại khách hàng bạn muốn sửa tên"
											onChange={(e) => setMaLKH(e.target.value)}
										>
											{(loaiKH) => <SelectItem key={loaiKH.MaLKH}>{loaiKH.TenLoaiTV}</SelectItem>}
										</Select>

										<Input
											label="Tên Loại khách hàng"
											labelPlacement="outside"
											placeholder="Tên mới cho loại khách hàng"
											isInvalid={actionLoaiKH.isError}
											errorMessage={actionLoaiKH.error?.message}
											value={tenLoaiKH}
											onValueChange={setTenLKH}
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
											items={LoaiKH}
											label="Loại khách hàng"
											labelPlacement="outside"
											placeholder="Chọn loại khách hàng bạn muốn sửa xóa"
											onChange={(e) => setMaLKH(e.target.value)}
										>
											{(loaiKH) => <SelectItem key={loaiKH.MaLKH}>{loaiKH.TenLoaiTV}</SelectItem>}
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
									isLoading={actionLoaiKH.isPending}
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
