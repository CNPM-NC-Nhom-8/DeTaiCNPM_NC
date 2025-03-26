import { create } from "zustand";

type CommentStore = {
	replyId: string | null;
	setReplyId: (id: string | null) => void;
	clearReplyId: () => void;
};

export const commentStore = create<CommentStore>((set) => ({
	replyId: null,
	setReplyId: (id) => set({ replyId: id }),
	clearReplyId: () => set({ replyId: null }),
}));
