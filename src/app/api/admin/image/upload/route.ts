import { env } from "@/env.mjs";
import PostHogClient from "@/server/posthog";
import { api } from "@/utils/trpc/server";

import { NextResponse } from "next/server";

import path from "path";
import { v4 } from "uuid";

export const POST = async (req: Request) => {
	const user = await api.common.getCurrentUser.query({ allowedRoles: ["NhanVien", "QuanTriVien"] });
	if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	const posthog = PostHogClient();
	posthog.capture({ distinctId: user.MaTaiKhoan, event: "Upload image" });
	await posthog.shutdownAsync();

	const data = await req.formData();
	const files = data.getAll("file") as File[];

	const successFilePaths: string[] = [];

	for (const file of files) {
		const reqData = new FormData();

		reqData.set("", file);
		reqData.set("cacheControl", "3600");

		const { ext } = path.parse(file.name);

		const res = await fetch(env.SUPABASE_URL + "/storage/v1/object/Images/" + v4() + ext, {
			body: reqData,
			method: "POST",
			headers: { Authorization: "Bearer " + env.SUPABASE_KEY },
		});

		if (!res.ok) {
			console.log(await res.json());
			continue;
		}

		const fileData = (await res.json()) as { Id: string; Key: string };
		successFilePaths.push(fileData.Key);
	}
	return NextResponse.json(
		successFilePaths.map((file) => ({
			path: env.SUPABASE_URL + "/storage/v1/object/public/" + file,
		})),
	);
};
