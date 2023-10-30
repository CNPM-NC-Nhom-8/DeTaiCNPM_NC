"use client";

import { trpc } from "@/utils/trpc/react";

import { ThemeSwitcher } from "../ThemeSwitcher";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignOutButton, useUser } from "@clerk/nextjs";
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

import { LogIn, LogOut, PackageSearch, Search, ShieldBan, ShoppingCart, UserCog, Users } from "lucide-react";

export const MainNavbar = () => {
	const { isLoaded, isSignedIn, user } = useUser();
	const pathname = usePathname();

	const cart = trpc.cart.layGioHang.useQuery(undefined, { refetchOnReconnect: false, refetchOnWindowFocus: false });

	const { data, isSuccess } = trpc.taiKhoan.getTaiKhoan.useQuery(undefined, {
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
					<Input
						isClearable
						type="text"
						variant="bordered"
						placeholder="Nhập từ khóa để tìm kiếm"
						startContent={<Search />}
					/>
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
								as="button"
								className="transition-transform"
								color="default"
								size="sm"
								src={!isLoaded && !!isSignedIn ? undefined : user?.imageUrl}
							/>
						</DropdownTrigger>

						{isLoaded && isSignedIn ? (
							<DropdownMenu aria-label="Profile Actions" variant="flat" closeOnSelect={false}>
								<DropdownItem showDivider key="profile" className="h-14 gap-2">
									<p className="font-semibold">Đăng nhập với</p>
									<p className="font-semibold">{user.emailAddresses[0].emailAddress}</p>
								</DropdownItem>

								{isSuccess && data && (data.Role === "QuanTriVien" || data.Role === "NhanVien") ? (
									<DropdownSection title="Quản Lý">
										<DropdownItem key="admin" startContent={<ShieldBan size={16} />}>
											<Link className="block w-full" href="/admin">
												Trang Admin
											</Link>
										</DropdownItem>

										<DropdownItem key="productManage" startContent={<PackageSearch size={16} />}>
											<Link className="block w-full" href="/admin/quan-li-san-pham">
												Quản lý sản phầm
											</Link>
										</DropdownItem>

										{data.Role === "QuanTriVien" ? (
											<DropdownItem key="staffManage" startContent={<Users size={16} />}>
												<Link className="block w-full" href="/admin/quan-li-nhan-su">
													Quản lý nhân sự
												</Link>
											</DropdownItem>
										) : (
											// Dumb typescript issue
											(undefined as any)
										)}
									</DropdownSection>
								) : (
									// Dumb typescript issue
									(undefined as any)
								)}

								<DropdownSection title="Cài đặt">
									<DropdownItem key="account" startContent={<UserCog size={16} />}>
										<Link className="block w-full" href="/auth/account">
											Cài đặt tài khoản
										</Link>
									</DropdownItem>

									<DropdownItem key="user" startContent={<UserCog size={16} />}>
										<Link className="block w-full" href="/auth/account/user">
											Cài đặt người dùng
										</Link>
									</DropdownItem>
								</DropdownSection>

								<DropdownSection title="Vùng nguy hiểm">
									<DropdownItem key="logout" color="danger" startContent={<LogOut size={16} />}>
										<SignOutButton>
											<button className="w-full text-left">Đăng Xuất</button>
										</SignOutButton>
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
