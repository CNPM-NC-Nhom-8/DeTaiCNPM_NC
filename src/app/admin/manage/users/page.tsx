import { UserTable } from "@/components/admin/users/UserTable";
import { ForbiddenPage } from "@/components/common/Page403";
import { api } from "@/utils/trpc/server";

import type { Metadata } from "next";

import { cache } from "react";

const getUser = cache(async () => {
	return api.common.getCurrentUser.query({ allowedRoles: ["QuanTriVien"] });
});

export const generateMetadata = async (): Promise<Metadata> => {
	const user = await getUser();

	if (!user) return { title: "Lỗi 403 - Cấm truy cập" };
	return { title: "Quản lý nhân sự - Trang Admin" };
};

export default async function Page() {
	const user = await getUser();
	if (!user) return <ForbiddenPage />;

	const [userData, LoaiKhachHang] = await Promise.all([
		api.admin.getUsers.query({ page: 1, perPage: 6 }),
		api.common.getLoaiKH.query(),
	]);

	return (
		<section className="flex w-full flex-col gap-2">
			<UserTable initialUsers={userData} initialLoaiKH={LoaiKhachHang} currentUserId={user.MaTaiKhoan} />
		</section>
	);
}
