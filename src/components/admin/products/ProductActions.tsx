"use client";

import { cn } from "@/utils/common";
import { api } from "@/utils/trpc/react";

import type { ProductType } from "./ProductTable";

import Link from "next/link";

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

import { MoreVertical, Package, Pencil, XCircle } from "lucide-react";
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
					onAction={(e) => {
						const action = e as typeof actionType;

						if (action === "Delete") {
							setActionType(action);
							onOpen();
						}
					}}
				>
					<DropdownSection showDivider title="Hành động">
						<DropdownItem
							key="Edit"
							as={Link}
							description="Chuyển qua trang sản phẩm"
							href={`/phone/${product.TenSP}`}
							startContent={<Package />}
						>
							Xem trang sản phẩm
						</DropdownItem>
						<DropdownItem
							key="Edit"
							as={Link}
							description="Cập nhật thông tin về sản phẩm"
							href={`/admin/manage/products/edit/${product.MaSPM}`}
							startContent={<Pencil />}
						>
							Cập nhật
						</DropdownItem>
					</DropdownSection>
					<DropdownSection title="Vùng nguy hiểm">
						<DropdownItem
							key="Delete"
							description="Xóa sản phẩm này"
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
						<ModalHeader className="flex flex-col gap-1">Xóa sản phẩm {product.TenSP}</ModalHeader>

						<ModalBody>
							<p>
								<span className="text-xl text-danger-600">Lưu ý:</span> Đây là 1 hành động không để đảo
								ngược, vui lòng xem xét kỹ trước khi xác nhận xóa!
							</p>
						</ModalBody>

						<ModalFooter>
							<Button color="primary" variant="light" onPress={onClose}>
								Đóng
							</Button>

							<Button
								type="submit"
								color="danger"
								isLoading={productActions.isLoading}
								onPress={() =>
									productActions.mutate({ maSPM: product.MaSPM, data: { type: "Delete" } })
								}
							>
								Xóa
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			)}
		</div>
	);
};
