"use client";

import { commentStore } from "@/components/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/utils/common";
import { api } from "@/utils/trpc/react";

import { Loader, SendHorizontal } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useStore } from "zustand";

type ParamsType = { maSPM: string };

export const CommentTextarea = ({ maSPM }: ParamsType) => {
	const replyId = useStore(commentStore, (state) => state.replyId);
	const clearReplyId = useStore(commentStore, (state) => state.clearReplyId);

	const [content, setNoiDung] = useState("");
	const utils = api.useUtils();

	const comment = api.comment.addComment.useMutation({
		onSuccess: async () => {
			setNoiDung("");
			clearReplyId();

			if (replyId) await utils.comment.getTraLoi.invalidate({ id: replyId });
			else await utils.comment.getDanhGia.invalidate({ maSPM });
		},
	});

	const submitComment = (event?: FormEvent<HTMLFormElement>) => {
		event?.preventDefault();
		comment.mutate({ maSPM, content, replyId: replyId!, soSao: 5 });
	};

	return (
		<div>
			<form className="space-y-4" onSubmit={submitComment}>
				<div>
					<Textarea
						id="comment-textarea"
						value={content}
						onChange={(e) => setNoiDung(e.target.value)}
						placeholder="Viết cảm nhận của bạn về sản phẩm này"
						disabled={comment.isPending}
						className={cn("w-full", { "border-destructive": comment.isError })}
						rows={4}
						onKeyDown={(e) => {
							if (e.ctrlKey && e.key === "Enter" && content.length > 0) submitComment();
						}}
					/>
					<div className={cn("flex justify-end", { "justify-between": comment.isError || replyId })}>
						{comment.isError && <span className="text-sm text-destructive">{comment.error.message}</span>}
						{replyId && <span className="text-sm">Bình luận đã được trả lời</span>}
						<span className="text-sm text-muted-foreground">{content.length} ký tự</span>
					</div>
				</div>

				<div className="flex justify-end">
					<Button type="submit" className="px-4 py-2 text-sm">
						{comment.isPending && <Loader className="animate-spin" />}
						{!comment.isPending && (
							<span>
								Gửi
								<SendHorizontal className="ml-2 inline-block" size={20} />
							</span>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
};
