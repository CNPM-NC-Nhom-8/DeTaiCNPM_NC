import { db } from "@/server/db";

import { NextResponse } from "next/server";

export const GET = async (_req: Request, context: { params: { id: string } }) => {
	const data = await db.sanPhamMau.findFirst({
		where: { MaSPM: context.params.id },
		include: {
			HinhAnh: true,
			ThongSoKyThuat: true,
			FAQ: true,
			HSX: true,
			SanPhamBienThe: { include: { MatHang: true } },
		},
	});

	return NextResponse.json(data);
};
