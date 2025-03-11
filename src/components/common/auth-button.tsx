"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useClerk } from "@clerk/nextjs";

import { LogIn, LogOut } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

export function SignInButton(props: Omit<ComponentPropsWithoutRef<typeof Link>, "href">) {
	const pathname = usePathname();

	return (
		<Link
			{...props}
			href={{ pathname: "/auth/login", query: { redirect_url: pathname } }}
			className="flex w-full items-center gap-2 text-left"
		>
			<LogIn size={16} /> Đăng Nhập
		</Link>
	);
}

export function SignOutButton(props: ComponentPropsWithoutRef<"button">) {
	const { signOut } = useClerk();
	const router = useRouter();

	return (
		<button
			{...props}
			className="flex w-full items-center gap-2 text-left"
			onMouseDown={() => signOut().then(() => router.refresh())}
		>
			<LogOut size={16} />
			Đăng Xuất
		</button>
	);
}
