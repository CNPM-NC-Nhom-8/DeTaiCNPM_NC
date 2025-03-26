"use client";

import { ObjectKeys, cn, dayjs } from "@/utils/common";
import type { RouterInputs, RouterOutputs } from "@/utils/trpc/react";
import { api } from "@/utils/trpc/react";

import { TablePagination } from "../Pagination";
import { LoaiKHActions } from "./LoaiKHActions";
import { UserActions } from "./UserActions";

import {
	Button,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
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
	User,
} from "@nextui-org/react";
import type { Role } from "@prisma/client";

import { ChevronDown, ChevronDownIcon, RotateCcw, SearchIcon } from "lucide-react";
import { type ChangeEvent, useCallback, useMemo, useState } from "react";

export type UserType = RouterOutputs["admin"]["getUsers"]["data"][number];

const allColumns: { name: string; uid: keyof UserType | "Actions"; sortable?: boolean }[] = [
	{ name: "ID", uid: "MaTaiKhoan", sortable: true },
	{ name: "Người dùng", uid: "TenTaiKhoan", sortable: true },
	{ name: "Số DT", uid: "SDT", sortable: true },
	{ name: "Trạng thái", uid: "Banned", sortable: true },
	{ name: "Chức Vụ", uid: "Role", sortable: true },
	{ name: "Loại Khách Hàng", uid: "TenLoaiTV", sortable: true },
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
	key: NonNullable<RouterInputs["admin"]["getUsers"]["query"]>["type"];
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
	initialUsers: RouterOutputs["admin"]["getUsers"];
	initialLoaiKH: RouterOutputs["common"]["getLoaiKH"];
}) => {
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState<(typeof perPage)[number]>(6);

	const [queryData, setQueryData] = useState<{
		type: (typeof searchType)[number]["key"];
		value: string;
		selectedRoles: Role[];
		selectedLoaiKH: string[];
	}>({
		type: "Search-Name",
		value: "",
		selectedRoles: [],
		selectedLoaiKH: [],
	});

	const {
		data: users,
		isRefetching,
		refetch: refetchData,
	} = api.admin.getUsers.useQuery(
		{
			page,
			perPage: rowsPerPage,
			query: {
				select: { loaiKH: queryData.selectedLoaiKH, roles: queryData.selectedRoles },
				type: queryData.type,
				value: queryData.value,
			},
		},
		{ initialData: initialUsers },
	);

	const { data: LoaiKH, refetch: refetchLoaiKH } = api.common.getLoaiKH.useQuery(undefined, {
		initialData: initialLoaiKH,
	});

	const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "age",
		direction: "ascending",
	});

	const capNhatNguoiDung = api.admin.updateUser.useMutation({
		onSuccess: async () => refetchData(),
	});

	const hasSearchFilter =
		Boolean(queryData.value) || Boolean(queryData.selectedRoles) || Boolean(queryData.selectedLoaiKH);

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return allColumns;

		return allColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
	}, [visibleColumns]);

	const sortedItems = useMemo(() => {
		if (isRefetching) return [];

		return [...users.data].sort((a, b) => {
			const first = a[sortDescriptor.column as keyof UserType];
			const second = b[sortDescriptor.column as keyof UserType];

			let cmp;

			if (first === null) cmp = -1;
			else if (second === null) cmp = 1;
			else cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, users.data, isRefetching]);

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
				<div className="flex items-end justify-between gap-2">
					<Select
						size="lg"
						defaultSelectedKeys={[queryData.type]}
						value={queryData.type}
						labelPlacement="outside"
						classNames={{ base: "w-1/4", value: "text-small" }}
						items={searchType}
						onChange={(e) => onQueryChange("type", e.target.value)}
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
				</div>

				<div className="grid grid-cols-[minmax(0,1fr),minmax(0,1fr),max-content] gap-2">
					<Select
						size="sm"
						radius="lg"
						label="Phân loại chức vụ"
						selectionMode="multiple"
						className="flex-grow"
						onChange={(e) => {
							const data = e.target.value
								.replaceAll("select-", "")
								.split(",")
								.filter((role) => role.length);

							onQueryChange("selectedRoles", data);
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

					<div className="flex">
						<Select
							size="sm"
							radius="lg"
							label="Phân loại loại khách hàng"
							selectionMode="multiple"
							classNames={{ trigger: "rounded-r-none" }}
							onChange={(e) => {
								const data = e.target.value
									.replaceAll("select-", "")
									.split(",")
									.filter((type) => type.length);

								onQueryChange("selectedLoaiKH", data);
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

						<LoaiKHActions
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
									{ "-rotate-[360deg]": isRefetching },
								)}
							/>
						}
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onPress={async () => await Promise.allSettled([refetchData(), refetchLoaiKH()])}
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
		users.count,
		hasSearchFilter,
		isRefetching,
		LoaiKH,
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

					<span>trong tổng số {users.count} người dùng</span>
				</section>

				<TablePagination
					data={users}
					isRefetching={isRefetching}
					page={page}
					rowsPerPage={rowsPerPage}
					setPage={setPage}
				/>
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, isRefetching, users.count]);

	const renderCell = useCallback(
		(user: UserType, columnKey: (typeof allColumns)[number]["uid"]) => {
			let cellValue = user[columnKey as keyof UserType];

			// * Note: Make typescript less mad, use product instead!
			if (typeof cellValue === "object") cellValue = "";

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
							classNames={{ popoverContent: "min-w-max" }}
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
							classNames={{ popoverContent: "min-w-max" }}
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

				case "NgayTaoTK": {
					const date = dayjs(user.NgayTaoTK);

					return (
						<Tooltip showArrow content={date.format("DD MMMM, YYYY, HH:mm")}>
							<span>{date.fromNow()}</span>
						</Tooltip>
					);
				}

				case "Banned":
					return (
						<div className="flex w-full items-center justify-center">
							<Chip
								className="capitalize"
								color={cn<"success" | "danger">({ success: !user.Banned, danger: user.Banned })}
								size="sm"
								variant="flat"
							>
								{user.Banned ? "Cấm hoạt động" : "Hoạt động"}
							</Chip>
						</div>
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[LoaiKH],
	);

	return (
		<Table
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
							"text-center": column.uid === "Banned",
						})}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>

			<TableBody
				isLoading={isRefetching}
				loadingContent={<Spinner label="Đang tải..." />}
				emptyContent={isRefetching ? undefined : "Không tìm thấy người dùng nào"}
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
