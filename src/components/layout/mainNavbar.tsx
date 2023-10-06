"use client";

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

import { SignOutButton, useUser } from "@clerk/nextjs";
import { LogIn, LogOut, Search, ShoppingCart, UserCog } from "lucide-react";
import { useAtom } from "jotai";

import Link from "next/link";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { countAtom } from "@/server/jotai/cart";

export const MainNavbar = () => {
	const { isLoaded, isSignedIn, user } = useUser();
	const [cardCount] = useAtom(countAtom);

	return (
		<Navbar isBordered shouldHideOnScroll classNames={{ wrapper: "max-w-6xl" }}>
			<NavbarBrand>
				<Link href="/">
					<p className="font-bold text-inherit">CellPhoneX</p>
				</Link>
			</NavbarBrand>

			<NavbarContent justify="center">
				<NavbarItem>
					<Input isClearable type="text" variant="bordered" placeholder="Nhập từ khóa để tìm kiếm" startContent={<Search />} />
				</NavbarItem>
			</NavbarContent>

			<NavbarContent justify="end">
				<NavbarItem>
					<ThemeSwitcher />
				</NavbarItem>

				<NavbarItem>
					<Button aria-label="Cart" size="sm" as={Link} href="/cart">
						<ShoppingCart size={20} />
						<span> {cardCount} </span>
					</Button>
				</NavbarItem>

				<NavbarItem>
					<Dropdown placement="bottom-end">
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
								<DropdownItem key="profile" className="h-14 gap-2">
									<p className="font-semibold">Đăng nhập với</p>
									<p className="font-semibold">{user.emailAddresses[0].emailAddress}</p>
								</DropdownItem>
								<DropdownSection title="Cài đặt">
									<DropdownItem key="settings" startContent={<UserCog size={16} />}>
										Cài đặt tài khoảng
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
									<Link href="/auth/login" className="block w-full">
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
