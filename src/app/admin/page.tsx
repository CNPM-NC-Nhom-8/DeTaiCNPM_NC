import { ForbiddenPage } from "@/components/common/Page403";
import { prisma } from "@/server/db/prisma";

import { Metadata } from "next";

import { auth } from "@clerk/nextjs";

const getUser = async () => {
	const { userId } = auth();
	if (!userId) return null;

	const user = await prisma.taiKhoan.findUnique({ where: { MaTaiKhoan: userId } });
	if (!user) return null;

	if (user.Role !== "NhanVien" && user.Role !== "QuanTriVien") return null;

	return user;
};

export const generateMetadata = async (): Promise<Metadata> => {
	const user = await getUser();

	if (!user) return { title: "Lỗi 403 - Cấm truy cập" };
	return { title: "Quản lý nhân sự - Trang Admin" };
};

export default async function Page() {
	const user = await getUser();

	if (!user) return <ForbiddenPage />;
	return <main></main>;
}
