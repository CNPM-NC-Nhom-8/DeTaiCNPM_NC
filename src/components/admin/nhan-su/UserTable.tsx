"use client";

import type { RouterInput, RouterOutput } from "@/server/trpc/trpc";
import { ObjectKeys, cn } from "@/utils/common";
import { dayjs } from "@/utils/dayjs";
import { trpc } from "@/utils/trpc/react";

import { ActionLoaiKHButton } from "./ActionLoaiKH";
import { UserActions } from "./UserActions";

import {
	Button,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
	Pagination,
	Select,
	SelectItem,
	Selection,
	SortDescriptor,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	User,
} from "@nextui-org/react";
import type { Role } from "@prisma/client";

import { ChevronDownIcon, RotateCcw, SearchIcon } from "lucide-react";
import { type ChangeEvent, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

export type userType = RouterOutput["admin"]["layTongThongTinNguoiDung"]["data"][number];

const allColumns: { name: string; uid: keyof userType | "Actions"; sortable?: boolean }[] = [
	{ name: "ID", uid: "MaTaiKhoan", sortable: true },
	{ name: "Người dùng", uid: "TenTaiKhoan", sortable: true },
	{ name: "Số DT", uid: "SDT", sortable: true },
	{ name: "Trạng thái", uid: "Banned", sortable: true },
	{ name: "Chức Vụ", uid: "Role", sortable: true },
	{ name: "Loại Thành Viên", uid: "TenLoaiTV", sortable: true },
	{ name: "Ngày Tham Gia", uid: "NgayTaoTK", sortable: true },
	{ name: "Hành Động", uid: "Actions" },
];

const roles: Record<Role, string> = {
	KhachHang: "Khách hàng",
	NhanVien: "Nhân viên",
	QuanTriVien: "Quản trị viên",
};

const INITIAL_VISIBLE_COLUMNS: (typeof allColumns)[number]["uid"][] = [
	"TenTaiKhoan",
	"Banned",
	"Role",
	"TenLoaiTV",
	"Actions",
];

const searchType: Array<{
	key: NonNullable<RouterInput["admin"]["layTongThongTinNguoiDung"]["search"]>["query"]["queryType"];
	value: string;
}> = [
	{ key: "Search-ID", value: "Mã ID" },
	{ key: "Search-Name", value: "Tên tài khoản" },
	{ key: "Search-Email", value: "Email" },
	{ key: "Search-SDT", value: "Số điên thoại" },
];

const perPage = [6, 12, 18] as const;

export const UserTable = ({
	currentUserId,
	initialUsers,
	initialLoaiKH,
}: {
	currentUserId: string;
	initialUsers: RouterOutput["admin"]["layTongThongTinNguoiDung"];
	initialLoaiKH: RouterOutput["admin"]["layLoaiKH"];
}) => {
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState<(typeof perPage)[number]>(6);

	const [filterValue, setFilterValue] = useState<{
		searchType: (typeof searchType)[number]["key"];
		searchValue: string;
		filterRole: Role[];
		filterType: string[];
	}>({
		searchType: "Search-Name",
		searchValue: "",
		filterRole: [],
		filterType: [],
	});

	const {
		data: users,
		isRefetching,
		refetch: refetchData,
	} = trpc.admin.layTongThongTinNguoiDung.useQuery(
		{
			page,
			perPage: rowsPerPage,
			search: {
				query: { queryType: filterValue.searchType, value: filterValue.searchValue },
				roles: filterValue.filterRole,
				type: filterValue.filterType,
			},
		},
		{
			initialData: initialUsers,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			onError: ({ message }) => toast.error("Lỗi: " + message),
			onSuccess: () => {
				const totalPages = Math.ceil(users.count / rowsPerPage);
				if (page > totalPages) setPage(totalPages);
			},
		},
	);

	const { data: LoaiKH, refetch: refetchLoaiKH } = trpc.admin.layLoaiKH.useQuery(undefined, {
		initialData: initialLoaiKH,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		onError: ({ message }) => {
			toast.error("Lỗi: " + message);
		},
	});

	const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "age",
		direction: "ascending",
	});

	const capNhatNguoiDung = trpc.admin.capNhatNguoiDung.useMutation({
		onSuccess: async () => refetchData(),
	});

	const hasSearchFilter =
		Boolean(filterValue.searchValue) || Boolean(filterValue.filterRole) || Boolean(filterValue.filterType);

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return allColumns;

		return allColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
	}, [visibleColumns]);

	const pages = Math.ceil(users.count / rowsPerPage);
	const sortedItems = useMemo(() => {
		return [...users.data].sort((a, b) => {
			const first = a[sortDescriptor.column as keyof userType];
			const second = b[sortDescriptor.column as keyof userType];

			let cmp;

			if (first === null) cmp = -1;
			else if (second === null) cmp = 1;
			else cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, users.data]);

	const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
		setRowsPerPage(Number(e.target.value.slice("per-page-".length)) as typeof rowsPerPage);
		setPage(1);
	}, []);

	const onSearchChange = useCallback((value?: string) => {
		if (value) {
			setFilterValue((prev) => ({ ...prev, searchValue: value }));
			setPage(1);
		} else {
			setFilterValue((prev) => ({ ...prev, searchValue: "" }));
		}
	}, []);

	const onClear = useCallback(() => {
		setFilterValue((prev) => ({ ...prev, searchValue: "", filterRole: [], filterType: [] }));
		setPage(1);
	}, []);

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex items-end justify-between gap-3">
					<div className="flex w-full gap-2">
						<Select
							defaultSelectedKeys={["Search-Name"]}
							value={filterValue.searchType}
							labelPlacement="outside"
							classNames={{ base: "w-1/4" }}
							items={searchType}
							onChange={(e) => {
								setFilterValue((prev) => ({
									...prev,
									searchType: e.target.value as typeof filterValue.searchType,
								}));
							}}
						>
							{(item) => <SelectItem key={item.key}>{item.value}</SelectItem>}
						</Select>

						<Input
							isClearable
							className="w-full"
							placeholder="Tìm kiếm..."
							startContent={<SearchIcon />}
							value={filterValue.searchValue}
							onClear={() => onClear()}
							onValueChange={onSearchChange}
						/>
					</div>

					<div className="flex gap-3">
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
					</div>
				</div>

				<div className="flex items-center justify-between">
					<span className="text-small text-default-400">Tổng {users.count} người dùng</span>

					<div>
						<Select
							size="sm"
							labelPlacement="outside-left"
							onChange={onRowsPerPageChange}
							defaultSelectedKeys={["per-page-" + rowsPerPage]}
							label="Cột từng trang"
							items={perPage.map((num) => ({ key: "per-page-" + num, value: String(num) }))}
							classNames={{
								label: "flex items-center h-8 whitespace-nowrap text-sm",
								base: "w-[180px]",
							}}
						>
							{(item) => <SelectItem key={item.key}>{item.value}</SelectItem>}
						</Select>
					</div>
				</div>

				<div className="flex gap-2">
					<Select
						size="sm"
						label="Phân loại chức vụ"
						selectionMode="multiple"
						defaultSelectedKeys={"all"}
						className="flex-grow"
						onChange={(e) => {
							const data = e.target.value
								.split(",")
								.filter((role) => role.length)
								.map((role) => role.slice("select-".length) as Role);

							setFilterValue((prev) => ({ ...prev, filterRole: data.length > 0 ? data : [] }));
						}}
					>
						{ObjectKeys(roles).map((role) => {
							return (
								<SelectItem key={["select", role].join("-")} value={role}>
									{roles[role]}
								</SelectItem>
							);
						})}
					</Select>

					<div className="flex w-1/2 flex-shrink-0">
						<Select
							size="sm"
							label="Phân loại loại khách hàng"
							defaultSelectedKeys={"all"}
							selectionMode="multiple"
							classNames={{ trigger: "rounded-r-none" }}
							onChange={(e) => {
								const data = e.target.value
									.split(",")
									.filter((type) => type.length)
									.map((type) => type.slice("select-".length));

								setFilterValue((prev) => ({ ...prev, filterType: data.length > 0 ? data : [] }));
							}}
						>
							{LoaiKH.map((type) => {
								return (
									<SelectItem key={["select", type.MaLKH].join("-")} value={type.MaLKH}>
										{type.TenLoaiTV}
									</SelectItem>
								);
							})}
						</Select>

						<ActionLoaiKHButton
							refetch={async () => await Promise.allSettled([refetchData(), refetchLoaiKH()])}
							LoaiKH={LoaiKH}
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
									{
										"-rotate-[360deg]": isRefetching,
									},
								)}
							/>
						}
						onClick={async () => {
							await Promise.allSettled([refetchData(), refetchLoaiKH()]);
						}}
					/>
				</div>
			</div>
		);
	}, [
		filterValue,
		visibleColumns,
		onSearchChange,
		onRowsPerPageChange,
		users.count,
		hasSearchFilter,
		isRefetching,
		LoaiKH,
	]);

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
	}, [page, pages, isRefetching, users.count]);

	const renderCell = useCallback(
		(user: userType, columnKey: (typeof allColumns)[number]["uid"]) => {
			let cellValue = user[columnKey as keyof userType];
			if (cellValue instanceof Date) cellValue = dayjs(cellValue).format("DD/MM/YYYY - HH:mm:ss");

			switch (columnKey) {
				case "TenTaiKhoan":
					return (
						<User
							avatarProps={{ radius: "lg", src: user.AnhDaiDien, showFallback: true }}
							description={user.Email}
							name={user.TenTaiKhoan}
						/>
					);

				case "SDT":
					if (!cellValue) return "Không có";
					return cellValue;

				case "Role":
					return (
						<Select
							aria-label="Cập nhật chức vụ"
							labelPlacement="outside"
							disabledKeys={["update-QuanTriVien"]}
							defaultSelectedKeys={[["update", user.Role].join("-")]}
							isDisabled={user.MaTaiKhoan === currentUserId || user.Banned}
							items={ObjectKeys(roles).map((role) => ({
								key: ["update", role].join("-"),
								value: roles[role],
							}))}
							onChange={(key) => {
								const role = key.target.value.slice("update-".length) as typeof user.Role;

								capNhatNguoiDung.mutate({
									maTaiKhoan: user.MaTaiKhoan,
									data: { type: "Update", role },
								});
							}}
						>
							{(item) => <SelectItem key={item.key}>{item.value}</SelectItem>}
						</Select>
					);

				case "TenLoaiTV":
					return (
						<Select
							aria-label="Cập nhật loại thành viên"
							labelPlacement="outside"
							defaultSelectedKeys={[user.MaLKH]}
							items={LoaiKH}
							isDisabled={user.Banned}
							onChange={(e) => {
								capNhatNguoiDung.mutate({
									maTaiKhoan: user.MaTaiKhoan,
									data: { type: "Update", maLKH: e.target.value },
								});
							}}
						>
							{(item) => <SelectItem key={item.MaLKH}>{item.TenLoaiTV}</SelectItem>}
						</Select>
					);

				case "Banned":
					return (
						<Chip
							className="capitalize"
							color={cn<"success" | "danger">({ success: !user.Banned, danger: user.Banned })}
							size="sm"
							variant="flat"
						>
							{user.Banned ? "Cấm hoạt động" : "Hoạt động"}
						</Chip>
					);

				case "Actions":
					return (
						<UserActions
							user={user}
							currentUserId={currentUserId}
							refetch={async () => await refetchData()}
						/>
					);

				default:
					return cellValue;
			}
		},
		[LoaiKH],
	);

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
				loadingContent={<Spinner label="Loading..." />}
				emptyContent={"Không tìm thấy người dùng nào"}
				items={sortedItems}
			>
				{(item) => (
					<TableRow key={item.MaTaiKhoan}>
						{(columnKey) => (
							<TableCell>{renderCell(item, columnKey as (typeof allColumns)[number]["uid"])}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

