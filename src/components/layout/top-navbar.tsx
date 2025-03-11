import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/trpc/server";

import { CartNavbar } from "../cart/cart-navbar";
import { SignInButton, SignOutButton } from "../common/auth-button";
import { SearchBar } from "../common/search-bar";
import { ThemeSwitcher } from "../themes-switcher";

import Image from "next/image";
import Link from "next/link";

import { History, PackageSearch, ShieldBan, User, UserCog, Users } from "lucide-react";
import { Suspense } from "react";

export function TopNavbar() {
	return (
		<nav className="sticky top-0 z-50 flex h-14 items-center justify-center border-b border-border bg-background/80 backdrop-blur backdrop-saturate-150">
			<header className="flex w-full max-w-6xl items-center justify-center px-4 py-2">
				<section>
					<Link href="/">
						<p className="text-2xl font-bold">CellPhoneX</p>
					</Link>
				</section>

				<section className="flex flex-1 items-center justify-end gap-2 justify-self-end">
					<SearchBar />
					<CartNavbar />
					<ThemeSwitcher />

					<Suspense
						fallback={
							<Button
								className="h-10 w-10 overflow-hidden rounded-full ring ring-border"
								variant="outline"
							>
								<User size={30} />
							</Button>
						}
					>
						<UserDropdown />
					</Suspense>
				</section>
			</header>
		</nav>
	);
}

async function UserDropdown() {
	const user = await api.common.getCurrentUser();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="relative h-10 w-10 overflow-hidden rounded-full ring ring-border" variant="outline">
					{user ? (
						<Image src={user.AnhDaiDien} alt="User profile image" unoptimized fill />
					) : (
						<User size={30} />
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				{user && (
					<>
						<DropdownMenuLabel>
							<p className="text-center font-semibold">Đăng nhập với</p>
							<p className="font-semibold">{user.Email}</p>
						</DropdownMenuLabel>

						{(user.Role === "QuanTriVien" || user.Role === "NhanVien") && (
							<>
								<DropdownMenuSeparator />

								<DropdownMenuGroup title="Quản Lý">
									<DropdownMenuItem key="admin">
										<Link className="flex w-full items-center gap-2" href="/admin">
											<ShieldBan size={16} />
											Trang Admin
										</Link>
									</DropdownMenuItem>

									<DropdownMenuItem key="productManage">
										<Link className="flex w-full items-center gap-2" href="/admin/manage/products">
											<PackageSearch size={16} />
											Quản lý sản phẩm
										</Link>
									</DropdownMenuItem>

									{user.Role === "QuanTriVien" && (
										<DropdownMenuItem key="staffManage">
											<Link className="flex w-full items-center gap-2" href="/admin/manage/users">
												<Users size={16} />
												Quản lý người dùng
											</Link>
										</DropdownMenuItem>
									)}
								</DropdownMenuGroup>
							</>
						)}

						<DropdownMenuSeparator />
						<DropdownMenuGroup title="Cài đặt">
							<DropdownMenuItem key="account">
								<Link className="flex w-full items-center gap-2" href="/auth/account/user">
									<UserCog size={16} />
									Cài đặt tài khoản
								</Link>
							</DropdownMenuItem>

							<DropdownMenuItem key="">
								<Link className="flex w-full items-center gap-2" href="/auth/account/history/payment">
									<History size={16} />
									Lịch sử đơn hàng
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuGroup title="Vùng nguy hiểm">
							<DropdownMenuItem key="logout" className="hover:bg-danger-600 hover:text-danger-foreground">
								<SignOutButton />
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</>
				)}

				{!user && (
					<DropdownMenuItem>
						<SignInButton />
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
