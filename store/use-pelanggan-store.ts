import { create } from "zustand";

interface PelangganState {
	deleteId: string | null;
	setDeleteId: (id: string | null) => void;
	reset: () => void;
}

export const usePelangganStore = create<PelangganState>((set) => ({
	deleteId: null,
	setDeleteId: (id) => set({ deleteId: id }),
	reset: () => set({ deleteId: null }),
}));
