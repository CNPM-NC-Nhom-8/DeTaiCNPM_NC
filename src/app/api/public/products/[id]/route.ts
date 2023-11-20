import { db } from "@/server/db";

import { NextResponse } from "next/server";

export const GET = async (_req: Request, context: { params: { id: string } }) => {
	const product = await db.sanPhamMau.findFirst({
		where: { MaSPM: context.params.id },
		include: {
			HinhAnh: true,
			ThongSoKyThuat: true,
			FAQ: true,
			HSX: true,
			SanPhamBienThe: { include: { MatHang: true } },
		},
	});

	if (!product) return NextResponse.json({ message: "Không tìm thấy sản phẩm" }, { status: 404 });

	const defaultProduct = product.SanPhamBienThe.sort((a, b) => a.Gia - b.Gia).at(0)!;

	return NextResponse.json({
		...product,
		GiaGoc: defaultProduct.Gia,
		SoLuong: defaultProduct.MatHang?.TonKho ?? 0,
	});
};
