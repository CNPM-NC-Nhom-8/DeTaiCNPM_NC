"use client";

import { dayjs } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterInputs, RouterOutputs } from "@/utils/trpc/shared";

import { TablePagination } from "../Pagination";
import { HangSXActions } from "./HangSXActions";
import { ProductActions } from "./ProductActions";

import Link from "next/link";

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Image,
	Input,
	Select,
	SelectItem,
	type Selection,
	type SortDescriptor,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
	cn,
} from "@nextui-org/react";

import { ChevronDown, ChevronDownIcon, Plus, RotateCcw, SearchIcon } from "lucide-react";
import { type ChangeEvent, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

export type ProductType = RouterOutputs["admin"]["getProducts"]["data"][number];

type additionKey = "Prices" | "Actions";

const allColumns: { name: string; uid: keyof ProductType | additionKey; sortable?: boolean }[] = [
	{ name: "Mã ID", uid: "MaSPM", sortable: true },
	{ name: "Sản phẩm", uid: "TenSP", sortable: true },
	{ name: "Giá gốc", uid: "Prices", sortable: true },
	{ name: "Hãng sản xuất", uid: "TenHSX", sortable: true },
	{ name: "Ngày Thêm", uid: "NgayThem", sortable: true },
	{ name: "Hành động", uid: "Actions" },
];

const INITIAL_VISIBLE_COLUMNS: (typeof allColumns)[number]["uid"][] = ["TenSP", "Prices", "TenHSX", "Actions"];

const queryType: Array<{
	key: NonNullable<RouterInputs["admin"]["getProducts"]["query"]>["type"];
	value: string;
}> = [
	{ key: "Search-ID", value: "Mã ID" },
	{ key: "Search-Name", value: "Tên sản phẩm" },
];

const perPage = [6, 12, 18, 25, 50] as const;

type QueryDataType = {
	valueType: (typeof queryType)[number]["key"];
	value: string;
	hangSX: string[];
};

export const ProductTable = ({
	initialProduct,
	initialHangSX,
}: {
	initialProduct: RouterOutputs["admin"]["getProducts"];
	initialHangSX: RouterOutputs["common"]["getHangSX"];
}) => {
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState<(typeof perPage)[number]>(6);

	const [queryData, setQueryData] = useState<QueryDataType>({
		valueType: "Search-Name",
		value: "",
		hangSX: [],
	});

	const {
		data: products,
		isRefetching,
		refetch: refetchProducts,
	} = api.admin.getProducts.useQuery(
		{
			page,
			perPage: rowsPerPage,
			query: { type: queryData.valueType, value: queryData.value, select: { hangSX: queryData.hangSX } },
		},
		{
			initialData: initialProduct,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			onError: ({ message }) => toast.error("Lỗi: " + message),
		},
	);

	const { data: HangSX, refetch: refetchHangSX } = api.common.getHangSX.useQuery(undefined, {
		initialData: initialHangSX,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	const capNhatSanPham = api.admin.updateProduct.useMutation({
		onSuccess: async () => refetchProducts(),
		onError: ({ message }) => toast.error("Lỗi: " + message),
	});

	const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "age",
		direction: "ascending",
	});

	const hasSearchFilter = Boolean(queryData.value);

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return allColumns;

		return allColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
	}, [visibleColumns]);

	const sortedItems = useMemo(() => {
		if (isRefetching) return [];

		return [...products.data].sort((a, b) => {
			const first = a[sortDescriptor.column as keyof ProductType];
			const second = b[sortDescriptor.column as keyof ProductType];

			let cmp;

			if (first === null || first === undefined) cmp = -1;
			else if (second === null || second === undefined) cmp = 1;
			else cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, products.data, isRefetching]);

	const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
		setRowsPerPage(Number(e.target.value.slice("per-page-".length)) as typeof rowsPerPage);
		setPage(1);
	}, []);

	const onQueryChange = useCallback((key: keyof typeof queryData, value?: string | unknown[]) => {
		if ((typeof value === "string" && value) || (Array.isArray(value) && value.length > 0)) {
			setQueryData((prev) => ({ ...prev, [key]: value }));
			setPage(1);
		} else {
			setQueryData((prev) => {
				if (typeof prev[key] === "string") return { ...prev, [key]: "" };
				if (Array.isArray(prev[key])) return { ...prev, [key]: [] };

				return prev;
			});
		}
	}, []);

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between gap-2">
					<Select
						size="lg"
						defaultSelectedKeys={["Search-Name"]}
						value={queryData.valueType}
						labelPlacement="outside"
						classNames={{ base: "w-1/4", value: "text-small" }}
						items={queryType}
						onChange={(e) => onQueryChange("valueType", e.target.value)}
					>
						{(item) => <SelectItem key={item.key}>{item.value}</SelectItem>}
					</Select>

					<Input
						size="sm"
						radius="lg"
						isClearable
						className="w-full"
						placeholder="Tìm kiếm..."
						startContent={<SearchIcon />}
						value={queryData.value}
						onClear={() => onQueryChange("value")}
						onValueChange={(value) => onQueryChange("value", value)}
					/>

					<Dropdown>
						<DropdownTrigger className="hidden sm:flex">
							<Button size="lg" className="text-small" endContent={<ChevronDownIcon />} variant="flat">
								Cột
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							disallowEmptySelection
							aria-label="Table Columns"
							closeOnSelect={false}
							selectedKeys={visibleColumns}
							selectionMode="multiple"
							onSelectionChange={setVisibleColumns}
						>
							{allColumns.map((column) => (
								<DropdownItem key={column.uid} className="capitalize">
									{column.name}
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>

					<Tooltip showArrow content="Thêm sản phẩm">
						<Button
							isIconOnly
							size="lg"
							as={Link}
							href="/admin/manage/products/create"
							startContent={<Plus size={20} />}
						/>
					</Tooltip>
				</div>

				<div className="grid grid-cols-[minmax(0,1fr),minmax(0,1fr),max-content] gap-2">
					<div className="flex">
						<Select
							size="sm"
							radius="lg"
							label="Phân loại hãng sản xuất"
							selectionMode="multiple"
							classNames={{ trigger: "rounded-r-none" }}
							onChange={(e) => {
								const data = e.target.value
									.replaceAll("select-", "")
									.split(",")
									.filter((type) => type.length);

								onQueryChange("hangSX", data);
							}}
						>
							{HangSX.map((item) => {
								return (
									<SelectItem key={["select", item.MaHSX].join("-")} value={item.MaHSX}>
										{item.TenHSX}
									</SelectItem>
								);
							})}
						</Select>

						<HangSXActions
							refetch={async () => await Promise.allSettled([refetchProducts(), refetchHangSX()])}
							HangSX={HangSX}
						/>
					</div>

					<Button
						size="lg"
						isIconOnly
						startContent={
							<RotateCcw
								size={20}
								className={cn(
									`rotate-0 transition-transform duration-1000 ease-linear will-change-transform`,
									{ "-rotate-[360deg]": isRefetching },
								)}
							/>
						}
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onPress={async () => await Promise.allSettled([refetchProducts(), refetchHangSX()])}
					/>
				</div>
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		queryData,
		visibleColumns,
		onQueryChange,
		onRowsPerPageChange,
		products.count,
		hasSearchFilter,
		isRefetching,
		HangSX,
	]);

	const bottomContent = useMemo(() => {
		return (
			<div className="flex items-center justify-between">
				<section className="flex items-center justify-center gap-2 whitespace-nowrap text-small text-default-400">
					<span>Hiển thị</span>

					<Select
						size="sm"
						onChange={onRowsPerPageChange}
						defaultSelectedKeys={["per-page-" + rowsPerPage]}
						items={perPage.map((num) => ({ key: "per-page-" + num, value: String(num) }))}
						selectorIcon={<ChevronDown />}
						classNames={{
							label: "whitespace-nowrap",
							base: "w-[70px]",
							trigger: "h-max min-h-0",
							popoverContent: "w-max",
						}}
					>
						{(item) => (
							<SelectItem key={item.key} className="px-1.5 py-1">
								{item.value}
							</SelectItem>
						)}
					</Select>

					<span>trong tổng số {products.count} sản phẩm</span>
				</section>

				<TablePagination
					data={products}
					isRefetching={isRefetching}
					page={page}
					rowsPerPage={rowsPerPage}
					setPage={setPage}
				/>
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, isRefetching, products.count]);

	const renderCell = useCallback((product: ProductType, columnKey: (typeof allColumns)[number]["uid"]) => {
		let cellValue = product[columnKey as keyof ProductType];

		// * Note: Make typescript less mad, use product instead!
		if (typeof cellValue === "object") cellValue = "";

		switch (columnKey) {
			case "TenSP": {
				return (
					<div className="flex items-center gap-4">
						<Image
							src={product.AnhBia}
							alt={product.TenSP}
							className="aspect-square max-w-full"
							width="112"
						/>

						<div className="flex max-w-sm flex-col gap-2">
							<h3 className="text-large font-semibold">{product.TenSP}</h3>
							<p className="line-clamp-2">{product.MoTa}</p>
						</div>
					</div>
				);
			}

			case "Prices": {
				const moneyFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "vnd" });
				return moneyFormat.format(product.SanPhamBienThe.sort((a, b) => a.Gia - b.Gia)[0]!.Gia);
			}

			case "TenHSX": {
				return (
					<Select
						aria-label="Cập nhật hãng sản xuất"
						labelPlacement="outside"
						defaultSelectedKeys={[product.MaHSX]}
						items={HangSX}
						classNames={{ popoverContent: "min-w-max" }}
						onChange={(e) => {
							capNhatSanPham.mutate({
								maSPM: product.MaSPM,
								data: { type: "Update", MaHangSX: e.target.value },
							});
						}}
					>
						{(item) => <SelectItem key={item.MaHSX}>{item.TenHSX}</SelectItem>}
					</Select>
				);
			}

			case "NgayThem": {
				const date = dayjs(product.NgayThem);

				return (
					<Tooltip showArrow content={date.format("DD MMMM, YYYY, HH:mm")}>
						<span>{date.fromNow()}</span>
					</Tooltip>
				);
			}

			case "Actions":
				return (
					<ProductActions
						product={product}
						refetch={async () => await Promise.allSettled([refetchProducts(), refetchHangSX()])}
					/>
				);

			default:
				return cellValue;
		}
	}, []);

	return (
		<Table
			isHeaderSticky
			bottomContent={bottomContent}
			bottomContentPlacement="outside"
			sortDescriptor={sortDescriptor}
			topContent={topContent}
			topContentPlacement="outside"
			onSortChange={setSortDescriptor}
			classNames={{ base: "flex-grow", wrapper: "flex-grow" }}
		>
			<TableHeader columns={headerColumns}>
				{(column) => (
					<TableColumn
						key={column.uid}
						allowsSorting={column.sortable}
						className={cn({
							"text-right": column.uid === "Actions",
						})}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				isLoading={isRefetching}
				loadingContent={<Spinner label="Đang tải..." />}
				emptyContent={isRefetching ? undefined : "Không tìm thấy sản phẩm nào"}
				items={sortedItems}
			>
				{(item) => (
					<TableRow key={item.MaSPM}>
						{(columnKey) => (
							<TableCell>{renderCell(item, columnKey as (typeof allColumns)[number]["uid"])}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
