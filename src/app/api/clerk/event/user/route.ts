import { env } from "@/env";
import { db } from "@/server/db";
import { tryCatch } from "@/utils/common";

import { NextResponse } from "next/server";

import type { WebhookEvent } from "@clerk/backend";

import { Webhook } from "svix";

export async function POST(request: Request) {
	const payload = (await request.json()) as WebhookEvent;
	const headers = Object.fromEntries(request.headers);

	const wh = new Webhook(env.CLERK_SIGNING_KEY);

	const { error } = await tryCatch(wh.verify(JSON.stringify(payload), headers));
	if (error) return NextResponse.json({ error: error.message }, { status: 400 });

	const { type, data } = payload;

	switch (type) {
		case "user.created": {
			const main_email = data.email_addresses.find((email) => email.id === data.primary_email_address_id)!;
			const main_phoneNum = data.phone_numbers.find((phone) => phone.id === data.primary_phone_number_id);

			await db.taiKhoan.create({
				data: {
					MaTaiKhoan: data.id,
					AnhDaiDien: data.image_url,
					Email: main_email.email_address,
					SDT: main_phoneNum?.phone_number,
					Ho: data.last_name,
					Ten: data.first_name,
					TenTaiKhoan: data.username,
					KhachHang: {
						create: {
							MaKhachHang: data.id,
							LoaiKhachHang: {
								connectOrCreate: {
									create: { TenLoaiTV: "Thông Thường" },
									where: { TenLoaiTV: "Thông Thường" },
								},
							},
						},
					},
				},
			});

			break;
		}

		case "user.updated": {
			const main_email = data.email_addresses.find((email) => email.id === data.primary_email_address_id)!;
			const main_phoneNum = data.phone_numbers.find((phone) => phone.id === data.primary_phone_number_id);

			await db.taiKhoan.update({
				where: { MaTaiKhoan: data.id },
				data: {
					AnhDaiDien: data.image_url,
					Email: main_email.email_address,
					SDT: main_phoneNum?.phone_number,
					Ho: data.last_name,
					Ten: data.first_name,
					TenTaiKhoan: data.username,
				},
			});

			break;
		}

		case "user.deleted":
			await db.taiKhoan.delete({ where: { MaTaiKhoan: data.id }, include: { KhachHang: true } });
			break;
	}

	return NextResponse.json({ success: true });
}
