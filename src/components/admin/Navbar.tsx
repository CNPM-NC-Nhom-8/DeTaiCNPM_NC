"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PackageSearch, Users } from "lucide-react";

export const AdminNavbar = () => {
	const pathName = usePathname();
	const defaultTab = pathName.slice("/admin/".length);

	return (
		<aside className="w-full">
			<Tabs defaultValue={defaultTab}>
				<TabsList className="w-full *:w-full">
					<TabsTrigger asChild value="manage/users">
						<Link href="/admin/manage/users">
							<div className="flex items-center space-x-2">
								<Users />
								<span>Quản lý người dùng</span>
							</div>
						</Link>
					</TabsTrigger>

					<TabsTrigger value="manage/products">
						<Link href="/admin/manage/products">
							<div className="flex items-center space-x-2">
								<PackageSearch />
								<span>Quản lý sản phẩm</span>
							</div>
						</Link>
					</TabsTrigger>
				</TabsList>
			</Tabs>
		</aside>
	);
};
