import { db } from "@/server/db";

import { NextResponse } from "next/server";

import { clerkClient } from "@clerk/nextjs/server";

export async function POST() {
	const client = await clerkClient();
	const users = await client.users.getUserList();

	if ((await db.taiKhoan.count()) === users.totalCount) {
		return NextResponse.json({ message: "No new users to synchronize." });
	}

	await db.taiKhoan.createMany({
		skipDuplicates: true,
		data: users.data.map((user) => {
			const main_email = user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)!;
			const main_phoneNum = user.phoneNumbers.find((phone) => phone.id === user.primaryPhoneNumberId);

			return {
				MaTaiKhoan: user.id,
				AnhDaiDien: user.imageUrl,
				Email: main_email.emailAddress,
				SDT: main_phoneNum?.phoneNumber,
				Ho: user.lastName,
				Ten: user.firstName,
				TenTaiKhoan: user.username,
				NgayTaoTK: new Date(user.createdAt),
				Banned: user.banned,
				KhachHang: {
					create: {
						MaKhachHang: user.id,
						LoaiKhachHang: {
							connectOrCreate: {
								create: { TenLoaiTV: "Thông Thường" },
								where: { TenLoaiTV: "Thông Thường" },
							},
						},
					},
				},
			};
		}),
	});

	return NextResponse.json({ message: "Users synchronized successfully." });
}
