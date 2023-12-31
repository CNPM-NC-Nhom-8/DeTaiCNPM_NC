import { AdminNavbar } from "@/components/admin/Navbar";

import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<main className="container flex max-w-6xl flex-grow flex-col gap-4 pt-4">
			<AdminNavbar />

			<section className="flex flex-grow">{children}</section>
		</main>
	);
}
