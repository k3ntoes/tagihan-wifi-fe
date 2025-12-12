import { create } from 'zustand';

interface DialogState {
    deleteDialog: {
        isOpen: boolean;
        itemId: string | null;
        itemName: string | null;
    };
    openDeleteDialog: (id: string, name: string) => void;
    closeDeleteDialog: () => void;
}

/**
 * Zustand store for UI state management
 * Used for dialogs, modals, and other client-side UI state
 * Server data is managed by React Query
 */
export const useDialogStore = create<DialogState>((set) => ({
    deleteDialog: {
        isOpen: false,
        itemId: null,
        itemName: null,
    },
    openDeleteDialog: (id, name) =>
        set({
            deleteDialog: {
                isOpen: true,
                itemId: id,
                itemName: name,
            },
        }),
    closeDeleteDialog: () =>
        set({
            deleteDialog: {
                isOpen: false,
                itemId: null,
                itemName: null,
            },
        }),
}));
