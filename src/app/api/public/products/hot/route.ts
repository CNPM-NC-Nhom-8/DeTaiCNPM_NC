import { db } from "@/server/db";

import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	const searchParams = new URL(req.url).searchParams;

	const page = Number(searchParams.get("page") ?? 1),
		perPage = Number(searchParams.get("perPage") ?? 10);

	const data = (
		await db.sanPhamMau.findMany({
			take: perPage,
			skip: Math.abs(page - 1) * perPage,
			include: {
				HinhAnh: true,
				ThongSoKyThuat: true,
				FAQ: true,
				HSX: true,
				SanPhamBienThe: { include: { MatHang: true } },
			},
			orderBy: { SanPhamBienThe: { _count: "desc" }, NgayThem: "desc" },
		})
	).map((product) => {
		const defaultProduct = product.SanPhamBienThe.sort((a, b) => a.Gia - b.Gia).at(0)!;

		return {
			...product,
			GiaGoc: defaultProduct.Gia,
			SoLuong: defaultProduct.MatHang?.TonKho ?? 0,
		};
	});

	return NextResponse.json(data);
};
