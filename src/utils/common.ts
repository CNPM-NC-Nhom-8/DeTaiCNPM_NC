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

export const ObjectKeys = <Obj extends Record<string, unknown>>(obj: Obj): (keyof Obj)[] => {
	return Object.keys(obj) as (keyof Obj)[];
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
