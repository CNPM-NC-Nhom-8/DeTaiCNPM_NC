"use client";

import { dayjs } from "@/utils/common";
import { api } from "@/utils/trpc/react";
import type { RouterOutputs } from "@/utils/trpc/shared";

import {
	Pagination,
	type Selection,
	type SortDescriptor,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/react";

import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

type productType = RouterOutputs["admin"]["getProductInfo"]["data"][number];

const allColumns: { name: string; uid: keyof productType | "Actions"; sortable?: boolean }[] = [
	{ name: "", uid: "Actions" },
];

const INITIAL_VISIBLE_COLUMNS: (typeof allColumns)[number]["uid"][] = ["Actions"];

export const ProductTable = ({
	initialProduct,
	HangSX,
}: {
	initialProduct: RouterOutputs["admin"]["getProductInfo"];
	HangSX: RouterOutputs["common"]["getHangSX"];
}) => {
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState<5 | 10 | 15>(5);

	const {
		data: products,
		isRefetching,
		refetch: refetchData,
	} = api.admin.getProductInfo.useQuery(
		{
			page,
			perPage: rowsPerPage,
		},
		{
			initialData: initialProduct,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			onError: ({ message }) => {
				toast.error("Lỗi: " + message);
			},
		},
	);

	const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "age",
		direction: "ascending",
	});

	// const capNhatSanPham = trpc.admin.capNhatNguoiDung.useMutation({
	// 	onSuccess: async () => refetchData(),
	// });

	// const hasSearchFilter =
	// 	Boolean(filterValue.searchValue) || Boolean(filterValue.filterRole) || Boolean(filterValue.filterType);

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return allColumns;

		return allColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
	}, [visibleColumns]);

	const pages = Math.ceil(products.count / rowsPerPage);
	const sortedItems = useMemo(() => {
		return [...products.data].sort((a, b) => {
			const first = a[sortDescriptor.column as keyof productType];
			const second = b[sortDescriptor.column as keyof productType];

			let cmp;

			if (first === null) cmp = -1;
			else if (second === null) cmp = 1;
			else cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, products.data]);

	const bottomContent = useMemo(() => {
		return (
			<div className="flex items-center justify-between px-2 py-2">
				<Pagination
					isDisabled={isRefetching}
					isCompact
					showControls
					showShadow
					color="primary"
					page={page}
					total={pages}
					onChange={setPage}
				/>
			</div>
		);
	}, [page, pages, isRefetching, products.count]);

	const renderCell = useCallback((user: productType, columnKey: (typeof allColumns)[number]["uid"]) => {
		let cellValue = user[columnKey as keyof productType];
		if (cellValue instanceof Date) cellValue = dayjs(cellValue).format("DD/MM/YYYY - HH:mm:ss");

		// * NOTE: Make typescript less mad
		if (typeof cellValue === "object") cellValue = "";

		switch (columnKey) {
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
			topContentPlacement="outside"
			onSortChange={setSortDescriptor}
			classNames={{ base: "flex-grow", wrapper: "flex-grow" }}
		>
			<TableHeader columns={headerColumns}>
				{(column) => (
					<TableColumn
						key={column.uid}
						align={column.uid === "Actions" ? "center" : "start"}
						allowsSorting={column.sortable}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				isLoading={isRefetching}
				loadingContent={<Spinner label="Đang tải..." />}
				emptyContent={"Không tìm thấy sản phẩm nào"}
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
