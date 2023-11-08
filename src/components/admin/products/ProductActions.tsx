"use client";

import { cn } from "@/utils/common";
import { api } from "@/utils/trpc/react";

import type { ProductType } from "./ProductTable";

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";

import { MoreVertical, Pencil, XCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const ProductActions = ({ product, refetch }: { product: ProductType; refetch: () => Promise<unknown> }) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	const [actionType, setActionType] = useState<"Edit" | "Delete">();

	const productActions = api.admin.updateProduct.useMutation({
		onSuccess: async () => {
			await refetch();
			onClose();

			setActionType(undefined);
		},
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	return (
		<div className="relative flex items-center justify-end gap-2">
			<Dropdown showArrow>
				<DropdownTrigger>
					<Button isIconOnly variant="light" startContent={<MoreVertical size={16} />} />
				</DropdownTrigger>
				<DropdownMenu
					itemClasses={{ description: "max-w-[200px]" }}
					disabledKeys={(() => {
						return [];
					})()}
					onAction={(e) => {
						setActionType(e as typeof actionType);
						onOpen();
					}}
				>
					<DropdownSection showDivider title="Hành động">
						<DropdownItem
							key="Edit"
							description="Cập nhật thông tin về sản phẩm"
							href="/admin/manage/products/edit"
							startContent={<Pencil />}
						>
							Cập nhật
						</DropdownItem>
					</DropdownSection>
					<DropdownSection title="Vùng nguy hiểm">
						<DropdownItem
							key="Delete"
							description="Xóa sản phẩm dùng này"
							className="text-danger"
							color="danger"
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

								switch (actionType) {
								}
							}}
						>
							<ModalHeader className="flex flex-col gap-1">{/* TODO: Update this */}</ModalHeader>

							<ModalBody>{/* TODO: Update this */}</ModalBody>

							<ModalFooter>
								<Button
									color={cn<"danger" | "primary">({
										primary: ["Delete", "Ban"].includes(actionType),
										danger: ["Edit", "Unban"].includes(actionType),
									})}
									variant="light"
									onPress={onClose}
								>
									Đóng
								</Button>

								<Button type="submit" isLoading={productActions.isLoading}>
									{/* TODO: Update this */}
								</Button>
							</ModalFooter>
						</form>
					</ModalContent>
				</Modal>
			)}
		</div>
	);
};
