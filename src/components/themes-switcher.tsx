"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "next-themes";

import { CheckIcon, Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuItem
					className="w-full cursor-pointer items-center justify-between gap-2"
					onMouseDown={() => setTheme("light")}
				>
					<span>Light</span>
					{theme === "light" && <CheckIcon />}
				</DropdownMenuItem>
				<DropdownMenuItem
					className="w-full cursor-pointer items-center justify-between gap-2"
					onMouseDown={() => setTheme("dark")}
				>
					<span>Dark</span>
					{theme === "dark" && <CheckIcon />}
				</DropdownMenuItem>
				<DropdownMenuItem
					className="en w-full cursor-pointer items-center justify-between gap-2"
					onMouseDown={() => setTheme("system")}
				>
					<span>System</span>
					{theme === "system" && <CheckIcon />}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
