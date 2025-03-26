"use client";

import { cn } from "@/utils/common";
import { useDebounce } from "@/utils/hooks/useDebounce";
import type { RouterOutputs } from "@/utils/trpc/react";
import { api } from "@/utils/trpc/react";

import { PhoneCard } from "../common/phone-card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LoaderIcon, SearchX } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { type ComponentPropsWithoutRef, Suspense, use, useEffect, useState } from "react";

const pageSizes = [20, 40, 60, 80, 100] as const;

type SearchContentProps = ComponentPropsWithoutRef<"div"> & {
	hangSXPromise: Promise<RouterOutputs["common"]["getHangSX"]>;
	isSignedIn?: boolean;
};

export function SearchContent({ className, hangSXPromise, isSignedIn, ...rest }: SearchContentProps) {
	const [amount, setAmount] = useState<number | null>(null);

	const [searchQuery, setSearchQuery] = useQueryState("query", parseAsString.withDefault(""));
	const [hangSXQuery, setHangSXQuery] = useQueryState("hangSX", parseAsString);

	const [pageSize, setPageSize] = useQueryState("pageSize", parseAsInteger.withDefault(20));
	const [pageIndex, setPageIndex] = useQueryState("page", parseAsInteger.withDefault(1));

	const debouncedSearchQuery = useDebounce(searchQuery, 500);
	const hangSX = use(hangSXPromise);

	return (
		<div {...rest} className={cn("flex flex-grow flex-col gap-2", className)}>
			<section className="flex flex-shrink-0 flex-col gap-2">
				<h3 className="text-lg font-semibold">
					{amount ?? "..."} Kết quả tìm kiếm
					<span> {debouncedSearchQuery.length > 0 && `cho "${debouncedSearchQuery}"`} </span>
					<span>
						{hangSXQuery &&
							hangSXQuery.length > 0 &&
							` - Hãng sản xuất: ${hangSX.find((item) => item.MaHSX === hangSXQuery)?.TenHSX}`}
					</span>
				</h3>

				<div className="flex items-center gap-2">
					<Input
						value={searchQuery ?? ""}
						placeholder="Nhập từ khóa bạn muốn tìm kiếm..."
						onChange={(event) =>
							event.target.value.length === 0 ? setSearchQuery(null) : setSearchQuery(event.target.value)
						}
					/>

					<Select
						value={hangSXQuery ?? ""}
						onValueChange={(value) => (value === "all" ? setHangSXQuery(null) : setHangSXQuery(value))}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Hãng sản xuất" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả</SelectItem>
							{hangSX.map((item) => (
								<SelectItem key={item.MaHSX} value={item.MaHSX}>
									{item.TenHSX}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
						<SelectTrigger className="w-[80px]">
							<SelectValue placeholder="Cột từng trang" />
						</SelectTrigger>
						<SelectContent>
							{pageSizes.map((item) => (
								<SelectItem key={`per-page-${item}`} value={item.toString()}>
									{item}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</section>

			<Suspense fallback={<LoadingSpinner onFinish={setAmount} />}>
				<ListSearchItem
					pageSize={pageSize}
					pageIndex={pageIndex}
					hangSXQuery={hangSXQuery ?? ""}
					isSignedIn={isSignedIn ?? false}
					debouncedSearchQuery={debouncedSearchQuery}
					setPageIndex={setPageIndex}
					onFinish={(amount) => setAmount(amount)}
				/>
			</Suspense>
		</div>
	);
}

function LoadingSpinner({ onFinish }: { onFinish: (amount: number | null) => void }) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => onFinish(null), []);

	return (
		<div className="flex flex-grow flex-col items-center justify-center gap-2">
			<LoaderIcon size={20} className="animate-spin" />
			<span>Đang tải dữ liệu...</span>
		</div>
	);
}

type ListSearchItemProps = ComponentPropsWithoutRef<"div"> & {
	isSignedIn: boolean;
	hangSXQuery: string;
	debouncedSearchQuery: string;
	pageSize: number;
	pageIndex: number;
	setPageIndex: (value: number | ((old: number) => number | null) | null) => void;
	onFinish: (amount: number | null) => void;
};

function ListSearchItem({
	isSignedIn,
	hangSXQuery,
	debouncedSearchQuery,
	pageSize,
	pageIndex,
	setPageIndex,
	onFinish,
}: ListSearchItemProps) {
	const [searchData] = api.product.searchProduct.useSuspenseQuery({
		pageIndex,
		pageSize,
		query: { hangSX: hangSXQuery, value: debouncedSearchQuery },
	});

	const totalPages = Math.ceil((searchData?.count ?? 0) / pageSize);
	onFinish(searchData.count ?? 0);

	return (
		<>
			<section className="flex flex-grow">
				{searchData.data.length === 0 && (
					<div className="flex flex-grow flex-col items-center justify-center gap-2">
						<SearchX size={48} />
						<span>Không tìm thấy sản phẩm nào</span>
					</div>
				)}

				{searchData.data.length > 0 && (
					<div className="grid h-full grid-cols-5 gap-2">
						{searchData.data.map((product) => (
							<PhoneCard key={product.MaSPM} sanPhamMau={product} isSignedIn={isSignedIn} />
						))}
					</div>
				)}
			</section>

			<section className="flex flex-shrink-0 items-center justify-end gap-2 px-2 py-2">
				<Button
					size="icon"
					variant="outline"
					disabled={totalPages <= 1 || pageIndex === 1}
					onMouseDown={() => setPageIndex(1)}
				>
					<ChevronsLeft className="size-4" />
				</Button>

				<Button
					size="icon"
					variant="outline"
					disabled={totalPages <= 1 || pageIndex === 0}
					onMouseDown={() => setPageIndex((prev) => prev - 1)}
				>
					<ChevronLeft className="size-4" />
				</Button>

				<Button asChild disabled variant="outline">
					<p className="text-sm font-medium">
						Trang {pageIndex}/{totalPages}
					</p>
				</Button>

				<Button
					size="icon"
					variant="outline"
					disabled={totalPages <= 1 || pageIndex === totalPages}
					onMouseDown={() => setPageIndex((prev) => prev + 1)}
				>
					<ChevronRight className="size-4" />
				</Button>

				<Button
					size="icon"
					variant="outline"
					disabled={totalPages <= 1 || pageIndex === totalPages}
					onMouseDown={() => setPageIndex(totalPages)}
				>
					<ChevronsRight className="size-4" />
				</Button>
			</section>
		</>
	);
}
