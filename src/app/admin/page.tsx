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
	return { title: "Quản lý nhân sự - Trang Admin" };
};

export default async function Page() {
	const user = await getUser();
	if (!user) return <ForbiddenPage />;

	return <main className="container flex max-w-6xl flex-grow flex-col gap-6 px-6 py-4"></main>;
}
