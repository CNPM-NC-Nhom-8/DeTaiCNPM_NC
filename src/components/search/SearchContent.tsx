"use client";

import { cn } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import { PhoneCard } from "../common/PhoneCard";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button, Divider, Input, Pagination, Select, SelectItem, Spinner } from "@nextui-org/react";

import { SearchX } from "lucide-react";
import { type ChangeEvent, Fragment, useCallback, useState } from "react";
import toast from "react-hot-toast";
import type { ClassNameValue } from "tailwind-merge";

const perPage = [20, 40, 60, 80, 100] as const;

export const SearchContent = ({
	initialData,
	className,
	hangSX,
}: {
	className?: ClassNameValue;
	initialData: RouterOutputs["product"]["searchProduct"];
	hangSX: RouterOutputs["common"]["getHangSX"];
}) => {
	const pathname = usePathname();
	const searchParams = new URLSearchParams(useSearchParams());
	const router = useRouter();

	const [searchQuery, setSearchQuery] = useState<{
		value: string;
		hangSX: string;
	}>({
		value: searchParams.get("query") ?? "",
		hangSX: "",
	});

	const [page, setPage] = useState(Number(searchParams.get("page") ?? "1"));
	const [rowsPerPage, setRowPerPage] = useState<(typeof perPage)[number]>(20);

	const { data: searchData, isRefetching } = api.product.searchProduct.useQuery(
		{
			pageNum: page,
			perPage: rowsPerPage,
			query: searchQuery,
		},
		{
			initialData,
			keepPreviousData: true,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			onError: ({ message }) => toast.error("Lỗi: " + message),
			onSuccess: () => {
				const totalPages = Math.ceil(searchData.count / rowsPerPage);
				if (page > totalPages) setPage(totalPages);
			},
		},
	);

	const pages = Math.ceil(searchData.count / rowsPerPage);

	const updatePage = useCallback((page: number, updateUrl = true) => {
		setPage(page);

		searchParams.set("page", (page + 1).toString());
		if (updateUrl) router.replace(pathname + "?" + searchParams.toString(), { scroll: false });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onNextPage = useCallback(() => {
		if (page < pages) {
			updatePage(page + 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, pages]);

	const onPreviousPage = useCallback(() => {
		if (page > 1) {
			updatePage(page - 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	const onPageChange = useCallback(
		(page: number) => {
			updatePage(page);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[page],
	);

	const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
		setRowPerPage(Number(e.target.value.slice("per-page-".length)) as typeof rowsPerPage);
		updatePage(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onValueChange = useCallback(
		({ value, hangSX }: { value?: string; hangSX?: string }) => {
			updatePage(1, false);

			if (typeof value !== "undefined") {
				setSearchQuery((prev) => ({ ...prev, value }));

				if (value.length) searchParams.set("query", value);
				else searchParams.delete("query");
			}

			if (typeof hangSX !== "undefined") {
				setSearchQuery((prev) => ({ ...prev, hangSX }));

				if (hangSX.length) searchParams.set("hangSX", hangSX);
				else searchParams.delete("hangSX");
			}

			router.replace(pathname + "?" + searchParams.toString(), { scroll: false });
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	return (
		<article className={cn("flex flex-grow flex-col gap-4", className)}>
			<section className="flex flex-shrink-0 flex-col gap-4">
				<h3 className="text-lg font-semibold">Kết quả tìm kiếm ({searchData.count}) </h3>

				<Input
					isClearable
					label="Tìm kiếm"
					labelPlacement="outside"
					value={searchQuery.value}
					placeholder="Nhập từ khóa bạn muốn tìm kiếm..."
					onValueChange={(value) => onValueChange({ value })}
				/>

				<div className="flex items-center gap-4">
					<Select
						labelPlacement="outside"
						placeholder="Phân loại theo hãng sản xuất"
						items={hangSX}
						label="Hãng sản xuất"
						className="max-w-xs"
						onChange={(e) => onValueChange({ hangSX: e.target.value })}
					>
						{(item) => <SelectItem key={item.MaHSX}>{item.TenHSX}</SelectItem>}
					</Select>

					<Select
						labelPlacement="outside"
						label="Cột từng trang"
						placeholder="Chọn số lượng hiển thị"
						items={perPage.map((num) => ({ key: "per-page-" + num, value: String(num) }))}
						onChange={onRowsPerPageChange}
						defaultSelectedKeys={["per-page-" + rowsPerPage]}
						className="w-[180px]"
					>
						{(item) => <SelectItem key={item.key}>{item.value}</SelectItem>}
					</Select>
				</div>
			</section>

			<Divider />

			<section
				className={cn("grid flex-grow grid-cols-5 gap-4", {
					"items-center justify-center": isRefetching || (!isRefetching && searchData.data.length === 0),
				})}
			>
				{isRefetching && <Spinner color="primary" label="Đang tải..." />}

				{!isRefetching && searchData.data.length === 0 && (
					<div className="col-span-5 flex flex-col items-center gap-4">
						<SearchX size={48} />
						<p>Không tìm thấy sản phẩm nào</p>
					</div>
				)}

				{!isRefetching &&
					searchData.data.map((product) => {
						return (
							<Fragment key={product.MaSPM}>
								<PhoneCard sanPhamMau={product} />
							</Fragment>
						);
					})}
			</section>

			<Divider />

			<section className="flex flex-shrink-0 items-center justify-between px-2 py-2">
				<Button isDisabled={pages <= 1 || isRefetching} color="primary" onPress={onPreviousPage}>
					Previous
				</Button>

				{pages > 0 && (
					<Pagination
						isDisabled={isRefetching}
						showShadow
						color="primary"
						page={page}
						total={pages}
						onChange={onPageChange}
					/>
				)}

				<Button isDisabled={pages <= 1 || isRefetching} color="primary" onPress={onNextPage}>
					Next
				</Button>
			</section>
		</article>
	);
};
