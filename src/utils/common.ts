import type { ThongSoKyThuat } from "@prisma/client";

import { type ClassValue, clsx } from "clsx";
import ogDayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import { twMerge } from "tailwind-merge";

const dayjs = ogDayjs;

dayjs.locale("vi");
dayjs.extend(relativeTime);

export { dayjs };

export const moneyFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "vnd" });
export const numberFormat = new Intl.NumberFormat("de-DE");

export const ObjectKeys = <Obj extends Record<string, unknown>>(obj: Obj): (keyof Obj)[] => {
	return Object.keys(obj) as (keyof Obj)[];
};

export const ObjectTyped = {
	keys: <Obj extends Record<string, unknown>>(obj: Obj) => {
		return Object.freeze(Object.keys(obj)) as ReadonlyArray<keyof Obj>;
	},
	entries: <Obj extends Record<string, unknown>>(obj: Obj) => {
		return Object.freeze(Object.entries(obj)) as ReadonlyArray<[keyof Obj, NonNullable<Obj[keyof Obj]>]>;
	},
	values: <Obj extends Record<string, unknown>>(obj: Obj) => {
		return Object.freeze(Object.values(obj)) as ReadonlyArray<NonNullable<Obj[keyof Obj]>>;
	},
};

export function cn<T extends string>(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs)) as T;
}

export const exclude = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
	return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key as K))) as T;
};

export const ThongSoKeyVietnamese = (key: keyof Omit<ThongSoKyThuat, "MaSPM" | "MaThongSo">) => {
	switch (key) {
		case "CamSau":
			return "Camera Sau";
		case "CamTruoc":
			return "Camera Trước";
		case "ManHinh":
			return "Màn Hình";
		case "HeDieuHanh":
			return "Hệ Điều Hành";
		case "DungLuong":
			return "Dung Lượng";
		default:
			return key;
	}
};

const storageTypeToSize = {
	TB: 1024 * 1024,
	GB: 1024,
	MB: 1,
};

export function sortStorage(a: string, b: string) {
	const storageRegex = /(\d+)\s*(TB|GB|MB)/i;

	const aMatch = storageRegex.exec(a);
	const bMatch = storageRegex.exec(b);

	if (!aMatch || !bMatch) return 0;

	const [, aSize, aType] = aMatch;
	const [, bSize, bType] = bMatch;

	return (
		parseInt(aSize ?? "0") * storageTypeToSize[aType?.toUpperCase() as keyof typeof storageTypeToSize] -
		parseInt(bSize ?? "0") * storageTypeToSize[bType?.toUpperCase() as keyof typeof storageTypeToSize]
	);
}

type Success<T> = {
	data: T;
	error: null;
};

type Failure<E> = {
	data: null;
	error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>>;
export async function tryCatch<T, E = Error>(input: T): Promise<Result<T, E>>;

export async function tryCatch<T, E = Error>(input: Promise<T> | T): Promise<Result<T, E>> {
	try {
		return { data: input instanceof Promise ? await input : input, error: null };
	} catch (error) {
		return { data: null, error: error as E };
	}
}
