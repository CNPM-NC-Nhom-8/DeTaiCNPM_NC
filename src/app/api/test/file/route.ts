import { db } from "@/server/db";

import * as csv from "csv-parser";
import { readFile } from "node:fs/promises";

const FAQ: { question: string; answer: string }[] = [
	{
		question: "Galaxy S23 Ultra có đi kèm bút S-Pen không?",
		answer: "Galaxy S23 Ultra đi kèm với bút S Pen và hỗ trợ nhiều tiện ích, nhờ bạn có thể ghi chú nhanh, đánh dấu và chỉnh sửa văn bản hay hình ảnh dưới dạng chữ viết tay hoặc phác thảo một cách thuận tiện.",
	},
	{
		question: "Galaxy S23 Ultra có những phiên bản màu sắc và bộ nhớ nào?",
		answer: "Galaxy S23 Ultra có các màu Xanh Botanic, Đen Phantom, Tím Lilac và Kem Cotton và có 3 tùy chọn dung lượng lưu trữ: 256GB, 512GB và 1TB.",
	},
	{
		question: "Galaxy S23 Ultra có gì khác so với Galaxy S22 Ultra?",
		answer: "Điểm cải tiến lớn nhất ở Galaxy S23 Ultra là máy có camera độ phân giải cao nhất trên điện thoại thông minh Galaxy ở 200MP, so với 108MP của S22 Ultra. Cùng với đó, dù dung lượng pin như nhau là 5000mAh, nhưng Galaxy S23 Ultra cung cấp khả năng phát video lên đến khoảng 26 giờ và hiệu năng mạnh mẽ hơn.",
	},
	{
		question: "Màn hình Galaxy S23 Ultra có những công nghệ gì nổi bật?",
		answer: "Màn hình thì Galaxy S23 Ultra sử dụng tấm nền Dynamic AMOLED 2X kèm kích thước 6.8 inch và tần số quét 120 Hz, QHD+ (1400 x 3088 Pixels) nhờ đó đem lại khung hình điện ảnh rõ nét và sống động.",
	},
	{
		question: "Camera Galaxy S23 Ultra nâng cấp trải nghiệm chụp ảnh như thế nào?",
		answer: "Sở hữu 5 camera gồm: camera selfie 12MP, Camera góc siêu rộng 12MP, Camera góc rộng 200MP, camera tele 10MP tiên tiến và hiện đại. Ảnh selfie thiếu sáng được AI tăng cường để có chi tiết sắc nét và màu sắc chính xác hơn. Và ảnh chân dung vào ban đêm được xác định rõ ràng nhờ phân tích độ sâu được AI phát hiện.",
	},
];

export async function GET() {
	try {
		const data = JSON.parse(await readFile("./public/MOCK_DATA.json", "utf8")) as {
			TenSP: string;
			MoTa: string;
			DacDiem: string;
			AnhBia: string;
			HinhAnh: string;
			NgayThem: string;
		}[];

		for (const line of data) {
			const { TenSP, MoTa, DacDiem, AnhBia, HinhAnh, NgayThem } = line;

			const dungLuong = [
				{ dungLuong: "1TB", gia: 32_990_000 + Math.floor(Math.random() * (3000000 - 1000000 + 1)) + 1000000 },
				{ dungLuong: "512GB", gia: 26_990_000 + Math.floor(Math.random() * (3000000 - 1000000 + 1)) + 1000000 },
				{ dungLuong: "256GB", gia: 22_490_000 + Math.floor(Math.random() * (3000000 - 1000000 + 1)) + 1000000 },
			];

			const colours = ["Tím", "Đen", "Xanh", "Trắng"];

			const sanPhamBienThe = dungLuong
				.map(({ dungLuong, gia }) => colours.map((color) => ({ DungLuong: dungLuong, Gia: gia, Mau: color })))
				.flat()
				.sort((a, b) => a.Mau.localeCompare(b.Mau));

			await db.sanPhamMau.create({
				data: {
					AnhBia: AnhBia,
					FAQ: {
						createMany: { data: FAQ.map(({ answer, question }) => ({ CauHoi: question, TraLoi: answer })) },
					},
					HinhAnh: {
						createMany: { data: Array.from({ length: 10 }).map(() => ({ TenHinh: "", Url: HinhAnh })) },
					},
					HSX: { connect: { MaHSX: "540afb64-6e0a-4543-bba5-3d23576e25e7" } },
					TenSP: TenSP,
					MoTa: MoTa,
					DacDiem: DacDiem,
					NgayThem: new Date(Number(NgayThem)),
					SanPhamBienThe: { createMany: { data: sanPhamBienThe, skipDuplicates: true } },
					ThongSoKyThuat: {
						create: {
							CamSau: "Siêu rộng: 12MP F2.2 (Dual Pixel AF)\nChính: 200MP F1.7 OIS ±3° (Super Quad Pixel AF)\nTele 1: 10MP F4.9 (10X, Dual Pixel AF) OIS,\nTele 2: 10MP F2.4 (3X, Dual Pixel AF) OIS Thu phóng chuẩn không gian 100X",
							ManHinh: "6.8 inches",
							CamTruoc: "12MP F2.2 (Dual Pixel AF)",
							Chip: "Snapdragon 8 Gen 2 (4 nm)",
							RAM: "8 GB",
							DungLuong: "256 GB",
							HeDieuHanh: "Android",
							Pin: "5.000mAh",
							SIM: "2 Nano SIM hoặc 1 Nano + 1 eSIM",
						},
					},
				},
				include: { SanPhamBienThe: true },
			});
		}

		return new Response("Success", { status: 200 });
	} catch (error) {
		console.error("Error reading file:", error);
		return new Response("Error reading file", { status: 500 });
	}
}
