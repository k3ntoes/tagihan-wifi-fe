import { create } from "zustand";

interface PaketState {
	searchQuery: string;
	deleteId: string | null;
	setSearchQuery: (query: string) => void;
	setDeleteId: (id: string | null) => void;
	reset: () => void;
}

export const usePaketStore = create<PaketState>((set) => ({
	searchQuery: "",
	deleteId: null,
	setSearchQuery: (query) => set({ searchQuery: query }),
	setDeleteId: (id) => set({ deleteId: id }),
	reset: () => set({ searchQuery: "", deleteId: null }),
}));
