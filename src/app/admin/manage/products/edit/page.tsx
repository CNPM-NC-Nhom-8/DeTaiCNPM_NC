import { ForbiddenPage } from "@/components/common/Page403";
import { api } from "@/utils/trpc/server";

import type { Metadata } from "next";

import { cache } from "react";

const getUser = cache(async () => {
	return await api.common.getCurrentUser.query({ allowedRoles: ["NhanVien", "QuanTriVien"] });
});

export const generateMetadata = async (): Promise<Metadata> => {
	const user = await getUser();

	if (!user) return { title: "Lỗi 403 - Cấm truy cập" };
	return { title: "Cập nhật sản phẩm - Trang Admin" };
};

export default async function EditProductPage() {
	const user = await getUser();
	if (!user) return <ForbiddenPage />;

	return <section className="flex w-full flex-col gap-2"></section>;
}
