import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      name: '',
      isSetup: false,
      isEditModalOpen: false,

      // Actions
      setName: (name) =>
        set({
          name: name.trim(),
          isSetup: true,
          isEditModalOpen: false,
        }),

      resetName: () =>
        set({
          name: '',
          isSetup: false,
          isEditModalOpen: false,
        }),

      openEditModal: () => set({ isEditModalOpen: true }),
      closeEditModal: () => set({ isEditModalOpen: false }),
    }),
    {
      name: 'taskflow-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

