"use client";

import { useDebounce } from "@/utils/hooks/useDebounce";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { useRouter } from "next/navigation";

import { SearchIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export function SearchBar() {
	const router = useRouter();
	const [searchQuery] = useQueryState("query", parseAsString.withDefault(""));
	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const query = new FormData(e.currentTarget).get("query") as string | undefined;
		if (!query || query === "") return;

		const searchQuery = new URLSearchParams();
		searchQuery.set("query", query);

		router.push("/search?" + searchQuery.toString());
	}

	return (
		<form
			className="group flex w-max overflow-hidden rounded focus-within:ring-1 focus-within:ring-ring"
			onSubmit={handleSubmit}
		>
			<div className="w-64">
				<Input
					type="text"
					name="query"
					autoComplete="off"
					className="rounded-none"
					placeholder="Nhập từ khóa để tìm kiếm"
					defaultValue={debouncedSearchQuery}
				/>
			</div>

			<Button size="icon" type="submit" variant="outline" className="rounded-none border-l-0">
				<SearchIcon size={20} />
			</Button>
		</form>
	);
}
