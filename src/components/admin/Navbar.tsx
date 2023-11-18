"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Tab, Tabs } from "@nextui-org/react";

import { PackageSearch, Users } from "lucide-react";

export const AdminNavbar = () => {
	const pathName = usePathname();

	return (
		<aside className="w-full">
			<Tabs
				variant="bordered"
				color="primary"
				classNames={{ base: "w-full", tabList: "w-full" }}
				selectedKey={pathName.slice("/admin/manage/".length).split("/").at(0)}
			>
				<Tab
					as={Link}
					key={"users"}
					href="/admin/manage/users"
					title={
						<div className="flex items-center space-x-2">
							<Users />
							<span>Quản lý người dùng</span>
						</div>
					}
				/>
				<Tab
					as={Link}
					href="/admin/manage/products"
					key={"products"}
					title={
						<div className="flex items-center space-x-2">
							<PackageSearch />
							<span>Quản lý sản phẩm</span>
						</div>
					}
				/>
			</Tabs>
		</aside>
	);
};
