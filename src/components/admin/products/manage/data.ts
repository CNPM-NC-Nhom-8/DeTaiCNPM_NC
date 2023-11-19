import type { ThongSoKyThuat } from "@prisma/client";
import type { DeepPartial } from "@trpc/server";

import { create } from "zustand";

export const detailsKeys: Exclude<keyof ThongSoKyThuat, "MaThongSo" | "MaSPM">[] = [
	"CamSau",
	"CamTruoc",
	"Chip",
	"DungLuong",
	"HeDieuHanh",
	"ManHinh",
	"Pin",
	"RAM",
	"SIM",
];

export type States = {
	files: (File & { preview: string })[];
	types: Record<string, Record<string, { price: number; quanlity: number }>>; // { storage: { color: { price: number; quanlity: number } } }
	features: string;
	details: DeepPartial<ThongSoKyThuat>;
	faq: { question: string; answer: string }[];
	name: string;
	description: string;
	maHangSX: string;
};

type Actions = {
	setFiles: (files: File[]) => void;
	setFAQ: (data: States["faq"][number]) => void;
	setFeatures: (data: string) => void;
	setName: (name: string) => void;
	setDetails: (key: string, value: string) => void;
	setDescription: (data: string) => void;
	setMaHangSX: (data: string) => void;

	addStorageType: (data: string) => void;
	removeStorageType: (data: string) => void;

	addColorType: (selectedStorage: string, data: { quanlity: number; price: number; color: string }) => void;
	removeColorType: (selectedStorage: string, data: string) => void;
};

export const useProductData = create<States & Actions>((set) => ({
	details: {},
	faq: [],
	features: "",
	files: [],
	types: {},
	name: "",
	description: "",
	maHangSX: "",

	setFiles: (data) =>
		set((state) => {
			const noDupOldFiles = state.files.filter(({ name }) => !data.map(({ name }) => name).includes(name));
			const newFiles = data.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }));

			return { ...state, files: noDupOldFiles.concat(newFiles) };
		}),

	setFAQ: (data) => set((state) => ({ ...state, faq: [...state.faq, data] })),

	setFeatures: (features) => set((state) => ({ ...state, features })),
	setName: (name) => set((state) => ({ ...state, name })),
	setDescription: (description) => set((state) => ({ ...state, description })),
	setMaHangSX: (maHangSX) => set((state) => ({ ...state, maHangSX })),

	setDetails: (key, value) => set((state) => ({ ...state, details: { ...state.details, [key]: value } })),

	// Storage & Color
	addStorageType: (data) =>
		set((state) => {
			const currentStorage = state.types[data];
			if (!currentStorage) return { ...state, types: { ...state.types, [data]: {} } };

			return state;
		}),

	removeStorageType: (data) =>
		set((state) => {
			const types = state.types;
			delete types[data];

			return { ...state, types };
		}),

	addColorType: (selectedStorage, data) =>
		set((state) => {
			const types = state.types;
			types[selectedStorage] = {
				...types[selectedStorage],
				[data.color]: { price: data.price, quanlity: data.quanlity },
			};

			return { ...state, types };
		}),

	removeColorType: (selectedStorage, data) =>
		set((state) => {
			const types = state.types;
			delete (types[selectedStorage] as Record<string, unknown>)[data];

			return { ...state, types };
		}),
}));
