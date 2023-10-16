import { NextResponse } from "next/server";

import { env } from "@/env.mjs";

import { prisma } from "@/server/db/prisma";

import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { Webhook } from "svix";

export async function POST(request: Request) {
	const payload = (await request.json()) as WebhookEvent;
	const headers = Object.fromEntries(request.headers);

	// const wh = new Webhook(env.CLERK_SIGNING_KEY);

	// try {
	// 	wh.verify(JSON.stringify(payload), headers);
	// } catch (err) {
	// 	return NextResponse.json({ error: new Error(err as string).message }, { status: 400 });
	// }

	const { type, data } = payload;

	switch (type) {
		case "user.created": {
			const main_email = data.email_addresses.filter((email) => email.id === data.primary_email_address_id)[0]!;
			const main_phoneNum = data.phone_numbers.filter((phone) => phone.id === data.primary_phone_number_id)[0];

			await prisma.taiKhoan.create({
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

		case "user.deleted": {
			await prisma.taiKhoan.delete({
				where: { MaTaiKhoan: data.id },
				include: { KhachHang: true },
			});

			break;
		}

		case "user.updated": {
			const main_email = data.email_addresses.filter((email) => email.id === data.primary_email_address_id)[0]!;
			const main_phoneNum = data.phone_numbers.filter((phone) => phone.id === data.primary_phone_number_id)[0];

			await prisma.taiKhoan.update({
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
	}

	return NextResponse.json({ success: true });
}
