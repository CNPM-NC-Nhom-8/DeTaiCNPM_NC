import { createTRPCRouter, publicProcedure, staffProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";

import z from "zod";

export const commentRouter = createTRPCRouter({
	getTraLoi: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		return await ctx.db.danhGia.findMany({
			where: { MaTraLoi: input.id },
			include: { KhachHang: { include: { TaiKhoan: true } }, _count: { select: { TraLoiBoi: true } } },
		});
	}),

	getDanhGia: publicProcedure
		.input(z.object({ maSPM: z.string(), limit: z.number(), cursor: z.string().nullish() }))
		.query(async ({ ctx, input }) => {
			const limit = input.limit;

			const danhGia = await ctx.db.danhGia.findMany({
				where: { MaSPM: input.maSPM, MaTraLoi: null },
				include: {
					KhachHang: {
						omit: { DiaChi: true },
						include: { TaiKhoan: { select: { AnhDaiDien: true } } },
					},
					_count: { select: { TraLoiBoi: true } },
				},
				take: limit + 1,
				orderBy: { NgayDanhGia: "desc" },
				cursor: input.cursor ? { MaDanhGia: input.cursor } : undefined,
			});

			let nextCursor: typeof input.cursor | undefined = undefined;

			if (danhGia.length > limit) {
				const nextItem = danhGia.pop();
				nextCursor = nextItem!.MaDanhGia;
			}

			return { danhGia, nextCursor };
		}),

	deleteDanhGia: staffProcedure.input(z.object({ maDanhGia: z.string() })).mutation(async ({ ctx, input }) => {
		const data = await ctx.db.danhGia.findUnique({ where: { MaDanhGia: input.maDanhGia } });

		if (!data) throw new TRPCError({ code: "BAD_REQUEST", message: "Không tìm thấy đánh giá" });
		await ctx.db.danhGia.delete({ where: { MaDanhGia: data.MaDanhGia } });
	}),

	addComment: publicProcedure
		.input(
			z.object({
				maSPM: z.string(),
				content: z.string().min(10, "Nội dung đánh giá không thể dưới 10 ký tự!"),
				replyId: z.string().optional(),
				maKhachHang: z.string().optional(),
				tenKhachHang: z.string().optional(),
				soSao: z.number().min(1).max(5),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.danhGia.create({
				data: {
					MaSPM: input.maSPM,
					NoiDungDG: input.content,
					SoSao: input.soSao,

					MaTraLoi: input.replyId,
					MaKhachHang: input.maKhachHang,
					TenKhachHang: input.tenKhachHang,
				},
			});
		}),
});
