import { UserTable } from "@/components/admin/nhan-su/UserTable";
import { ForbiddenPage } from "@/components/common/Page403";
import { trpc } from "@/utils/trpc/server";

import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
	const user = await trpc.admin.layNguoiDungHienTai.query({ allowedRoles: ["QuanTriVien"] });

	if (!user) return { title: "Lỗi 403 - Cấm truy cập" };
	return { title: "Quản lý nhân sự - Trang Admin" };
};

export default async function Page() {
	const user = await trpc.admin.layNguoiDungHienTai.query({ allowedRoles: ["QuanTriVien"] });
	if (!user) return <ForbiddenPage />;

	const [userData, LoaiKhachHang] = await Promise.all([
		trpc.admin.layTongThongTinNguoiDung.query({ page: 1, perPage: 6 }),
		trpc.admin.layLoaiKH.query(),
	]);

	return (
		<section className="flex w-full flex-col gap-2">
			<UserTable initialUsers={userData} initialLoaiKH={LoaiKhachHang} currentUserId={user.MaTaiKhoan} />
		</section>
	);
}
