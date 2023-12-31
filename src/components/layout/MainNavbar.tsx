"use client";

import { api } from "@/utils/trpc/react";

import { ThemeSwitcher } from "../ThemeSwitcher";
import { SearchBar } from "../common/SearchBar";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useClerk } from "@clerk/nextjs";
import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	Input,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@nextui-org/react";

import {
	History,
	LogIn,
	LogOut,
	PackageSearch,
	Search,
	ShieldBan,
	ShoppingCart,
	User2,
	UserCog,
	Users,
} from "lucide-react";

export const MainNavbar = () => {
	const pathname = usePathname();
	const { signOut } = useClerk();

	const cart = api.cart.getCartItems.useQuery(undefined, {
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});

	const {
		data: user,
		isSuccess,
		isLoading,
		refetch,
	} = api.common.getCurrentUser.useQuery(undefined, {
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});

	return (
		<Navbar isBordered shouldHideOnScroll classNames={{ wrapper: "max-w-6xl" }}>
			<NavbarBrand>
				<Link href="/">
					<p className="text-2xl font-bold">CellPhoneX</p>
				</Link>
			</NavbarBrand>

			<NavbarContent justify="center">
				<NavbarItem>
					<SearchBar />
				</NavbarItem>
			</NavbarContent>

			<NavbarContent justify="end">
				<NavbarItem>
					<ThemeSwitcher />
				</NavbarItem>

				<NavbarItem>
					<Button
						aria-label="Cart"
						as={Link}
						href="/cart"
						isLoading={cart.isLoading}
						startContent={<ShoppingCart size={20} />}
					>
						{!cart.isLoading && ((cart.isSuccess && cart.data.length) || 0)}
					</Button>
				</NavbarItem>

				<NavbarItem>
					<Dropdown showArrow>
						<DropdownTrigger>
							<Avatar
								isBordered
								showFallback
								as="button"
								className="transition-transform"
								color="default"
								size="sm"
								src={isSuccess && user ? user.AnhDaiDien : undefined}
							/>
						</DropdownTrigger>

						{!isLoading && isSuccess && user ? (
							<DropdownMenu aria-label="Profile Actions" variant="flat" closeOnSelect={false}>
								<DropdownItem showDivider key="profile" className="h-14 gap-2">
									<p className="font-semibold">Đăng nhập với</p>
									<p className="font-semibold">{user.Email}</p>
								</DropdownItem>

								{user.Role === "QuanTriVien" || user.Role === "NhanVien" ? (
									<DropdownSection title="Quản Lý">
										<DropdownItem key="admin" startContent={<ShieldBan size={16} />}>
											<Link className="block w-full" href="/admin">
												Trang Admin
											</Link>
										</DropdownItem>

										<DropdownItem key="productManage" startContent={<PackageSearch size={16} />}>
											<Link className="block w-full" href="/admin/manage/products">
												Quản lý sản phẩm
											</Link>
										</DropdownItem>

										{user.Role === "QuanTriVien" ? (
											<DropdownItem key="staffManage" startContent={<Users size={16} />}>
												<Link className="block w-full" href="/admin/manage/users">
													Quản lý người dùng
												</Link>
											</DropdownItem>
										) : (
											// Dumb typescript issue
											// eslint-disable-next-line @typescript-eslint/no-explicit-any
											(undefined as any)
										)}
									</DropdownSection>
								) : (
									// Dumb typescript issue
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									(undefined as any)
								)}

								<DropdownSection title="Cài đặt">
									<DropdownItem key="account" startContent={<User2 size={16} />}>
										<Link className="block w-full" href="/auth/account">
											Cài đặt tài khoản
										</Link>
									</DropdownItem>

									<DropdownItem key="user" startContent={<UserCog size={16} />}>
										<Link className="block w-full" href="/auth/account/user">
											Cài đặt người dùng
										</Link>
									</DropdownItem>

									<DropdownItem key="" startContent={<History size={16} />}>
										<Link className="block w-full" href="/auth/account/history/payment">
											Lịch sử đơn hàng
										</Link>
									</DropdownItem>
								</DropdownSection>

								<DropdownSection title="Vùng nguy hiểm">
									<DropdownItem key="logout" color="danger" startContent={<LogOut size={16} />}>
										<button
											className="w-full text-left"
											onClick={async () => await signOut().then(async () => await refetch())}
										>
											Đăng Xuất
										</button>
									</DropdownItem>
								</DropdownSection>
							</DropdownMenu>
						) : (
							<DropdownMenu aria-label="Profile Actions" variant="flat">
								<DropdownItem startContent={<LogIn size={16} />} key="login">
									<Link
										href={{ pathname: "/auth/login", query: { redirect_url: pathname } }}
										className="block w-full"
									>
										Đăng Nhập
									</Link>
								</DropdownItem>
							</DropdownMenu>
						)}
					</Dropdown>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
};
