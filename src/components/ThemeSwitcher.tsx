"use client";

import { Button, Switch } from "@nextui-org/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useEffect, useState } from "react";

export function ThemeSwitcher() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<Button
			isIconOnly
			size="sm"
			radius="full"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			startContent={theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
		/>
	);
}
