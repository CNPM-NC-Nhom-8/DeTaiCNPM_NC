import { ProductTable } from "@/components/admin/san-pham/productTable";
import { ForbiddenPage } from "@/components/common/Page403";
import { prisma } from "@/server/db/prisma";
import { trpc } from "@/utils/trpc/server";

import type { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
	const user = await trpc.admin.layNguoiDungHienTai.query({ allowedRoles: ["QuanTriVien", "NhanVien"] });

	if (!user) return { title: "Lỗi 403 - Cấm truy cập" };
	return { title: "Quản lý nhân sự - Trang Admin" };
};

export default async function ProductManagePage() {
	const user = await trpc.admin.layNguoiDungHienTai.query({ allowedRoles: ["QuanTriVien"] });
	if (!user) return <ForbiddenPage />;

	const [productData, HangSX] = await Promise.all([
		trpc.admin.layThongTinSanPham.query({ page: 1, perPage: 5 }),
		prisma.hangSanXuat.findMany(),
	]);

	return (
		<section className="flex w-full flex-col gap-2">
			<ProductTable initialProduct={productData} HangSX={HangSX} />
		</section>
	);
}
