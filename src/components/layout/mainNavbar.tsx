"use client";

import {
	Avatar,
	Button,
	Divider,
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
	Spacer,
} from "@nextui-org/react";

import { countAtom } from "@/server/jotai/cart";
import { trpc } from "@/utils/trpc/client";
import { ThemeSwitcher } from "../ThemeSwitcher";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { LogIn, LogOut, Search, ShieldBan, ShoppingCart, UserCog } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const MainNavbar = () => {
	const { isLoaded, isSignedIn, user } = useUser();
	const [cardCount] = useAtom(countAtom);

	const { data, isSuccess } = trpc.taiKhoan.getTaiKhoan.useQuery(undefined, {
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});

	const pathname = usePathname();

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
					<Button aria-label="Cart" as={Link} href="/cart">
						<ShoppingCart size={20} />
						<span> {cardCount} </span>
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
							<DropdownMenu aria-label="Profile Actions" variant="flat">
								<DropdownSection showDivider>
									<DropdownItem key="profile" className="h-14 gap-2">
										<p className="font-semibold">Đăng nhập với</p>
										<p className="font-semibold">{user.emailAddresses[0].emailAddress}</p>
									</DropdownItem>
								</DropdownSection>

								{isSuccess && data && (data.Role === "QuanTriVien" || data.Role === "NhanVien") ? (
									<DropdownSection title="Quản trị viên">
										<DropdownItem key="admin" startContent={<ShieldBan size={16} />}>
											<Link href="/admin">Trang Admin</Link>
										</DropdownItem>
									</DropdownSection>
								) : (
									// Dumb typescript issue
									(undefined as any)
								)}

								<DropdownSection title="Cài đặt">
									<DropdownItem key="account" startContent={<UserCog size={16} />}>
										<Link href="/auth/account">Cài đặt tài khoản</Link>
									</DropdownItem>

									<DropdownItem key="user" startContent={<UserCog size={16} />}>
										<Link href="/auth/account/user">Cài đặt người dùng</Link>
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
