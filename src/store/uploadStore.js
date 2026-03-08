import { create } from "zustand";

export const uploadStore = create((set) => ({
  files: [],
  postId: null,
  setFiles: (files) => set({ files }),
  setPostId: (postId) => set({ postId }),
  clearFiles: () =>
    set({
      files: [],
    }),
}));
