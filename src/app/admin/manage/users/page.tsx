import { UserTable } from "@/components/admin/users/UserTable";
import { api } from "@/utils/trpc/server";

import type { Metadata } from "next";
import { forbidden } from "next/navigation";

import { cache } from "react";

const getUser = cache(async () => {
	return api.common.getCurrentUser({ allowedRoles: ["QuanTriVien"] });
});

export const generateMetadata = async (): Promise<Metadata> => {
	const user = await getUser();

	if (!user) return { title: "Lỗi 403 - Cấm truy cập" };
	return { title: "Quản lý người dùng - Trang Admin" };
};

export default async function Page() {
	const user = await getUser();
	if (!user) forbidden();

	const [userData, LoaiKhachHang] = await Promise.all([
		api.admin.getUsers({ page: 1, perPage: 6 }),
		api.common.getLoaiKH(),
	]);

	return (
		<section className="flex w-full flex-col gap-2">
			<UserTable initialUsers={userData} initialLoaiKH={LoaiKhachHang} currentUserId={user.MaTaiKhoan} />
		</section>
	);
}
