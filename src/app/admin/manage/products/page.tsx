import { ProductTable } from "@/components/admin/products/ProductTable";
import { ForbiddenPage } from "@/components/common/Page403";
import { api } from "@/utils/trpc/server";

import type { Metadata } from "next";

import { cache } from "react";

const getUser = cache(async () => {
	return await api.common.getCurrentUser({ allowedRoles: ["NhanVien", "QuanTriVien"] });
});

export const generateMetadata = async (): Promise<Metadata> => {
	const user = await getUser();

	if (!user) return { title: "Lỗi 403 - Cấm truy cập" };
	return { title: "Quản lý sản phẩm - Trang Admin" };
};

export default async function ProductManagePage() {
	const user = await getUser();
	if (!user) return <ForbiddenPage />;

	const [productData, HangSX] = await Promise.all([
		api.admin.getProducts({ page: 1, perPage: 6 }),
		api.common.getHangSX(),
	]);

	return (
		<section className="flex w-full flex-col gap-2">
			<ProductTable initialProduct={productData} initialHangSX={HangSX} />
		</section>
	);
}
