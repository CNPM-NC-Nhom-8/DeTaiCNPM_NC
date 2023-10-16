import { ThongSoKyThuat } from "@prisma/client";

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
