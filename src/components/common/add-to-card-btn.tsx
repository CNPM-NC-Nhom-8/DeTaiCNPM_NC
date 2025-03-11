import { api } from "@/utils/trpc/react";

import { Button } from "../ui/button";

import { useRouter } from "next/navigation";

import type { MatHang, SanPhamBienThe } from "@prisma/client";

import { LoaderIcon, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

type ParamsType = {
	data: SanPhamBienThe & { MatHang: MatHang | null };
	productName: string;
};

export function AddToCart({ data, productName }: ParamsType) {
	const router = useRouter();

	const addToCart = api.cart.addItemIntoCart.useMutation({
		onError: ({ message }) => toast.error("Lỗi: " + message),
		onMutate: () => toast.loading(`Đang thêm ${productName} vào giỏ hàng`, { id: `add-to-cart-${data.MaSP}` }),
		onSuccess: () => {
			toast.success(`Thêm ${productName} vào giỏ hàng thành công`, { id: `add-to-cart-${data.MaSP}` });
			router.refresh();
		},
	});

	return (
		<Button
			title="Thêm vào giỏ hàng"
			variant="outline"
			className="w-full rounded-r-none"
			disabled={!data?.MatHang?.TonKho || addToCart.isPending}
			onMouseDown={() => addToCart.mutate({ quanlity: 1, insuranceOption: "None", maSP: data.MaSP })}
		>
			{addToCart.isPending ? <LoaderIcon size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
		</Button>
	);
}
