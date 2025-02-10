import { CreateProduct } from "@/components/admin/products/manage/CreateProduct";
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
	return { title: "Thêm sản phẩm - Trang Admin" };
};

export default async function Page() {
	const user = await getUser();
	if (!user) return <ForbiddenPage />;

	const HangSX = await api.common.getHangSX();

	return (
		<section className="flex w-full flex-col gap-2">
			<CreateProduct hangSX={HangSX} />
		</section>
	);
}
