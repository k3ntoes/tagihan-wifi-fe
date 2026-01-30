import { create } from "zustand";

interface TagihanStore {
	deleteId: string | null;
	setDeleteId: (id: string | null) => void;
	reset: () => void;
}

export const useTagihanStore = create<TagihanStore>((set) => ({
	deleteId: null,
	setDeleteId: (id) => set({ deleteId: id }),
	reset: () => set({ deleteId: null }),
}));
