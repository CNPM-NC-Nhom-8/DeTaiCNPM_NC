"use client";

import { Switch } from "@nextui-org/react";
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
		<Switch
			isSelected={theme === "light"}
			onValueChange={() => setTheme(theme === "dark" ? "light" : "dark")}
			defaultSelected
			color="success"
			startContent={<Sun />}
			endContent={<Moon />}
		/>
	);
}
