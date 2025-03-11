import { env } from "@/env";

import { NextResponse } from "next/server";

import path from "path";
import { v4 } from "uuid";

export const POST = async (req: Request) => {
	const data = await req.formData();
	const files = data.getAll("file") as File[];

	const successFilePaths: string[] = [];

	for (const file of files) {
		const reqData = new FormData();

		reqData.set("", file);
		reqData.set("cacheControl", "3600");

		const { ext } = path.parse(file.name);

		const fileName = v4() + ext;
		const res = await fetch("https://ciuknuwpoenunhtkijcv.supabase.co/storage/v1/object/Images/" + fileName, {
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
			path: "https://ciuknuwpoenunhtkijcv.supabase.co/storage/v1/object/public/" + file,
			fileName: file,
		})),
	);
};
