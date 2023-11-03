"use client";

import { useTheme } from "next-themes";

import { Button } from "@nextui-org/react";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return <Button isLoading isIconOnly />;

	return (
		<Button
			isIconOnly
			onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
			startContent={theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
		/>
	);
}
