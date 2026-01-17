import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type PickerItem = {
  id: string;
  name: string;
  color?: string;
};

export type PickerCategory = {
  id: string;
  name: string;
  items: PickerItem[];
};

export type PickerType = 'wheel' | 'slot';

type Settings = {
  pickerType: PickerType;
  spinTime: number;
  showWinner: boolean;
  soundEnabled: boolean;
  confetti: boolean;
};

type State = {
  categories: PickerCategory[];
  currentCategoryId: string | null;
  settings: Settings;
  winner: PickerItem | null;
};

type Actions = {
  addCategory: (name: string) => void;
  editCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  setCurrentCategoryId: (id: string) => void;
  addItem: (categoryId: string, name: string) => void;
  editItem: (categoryId: string, itemId: string, name: string) => void;
  deleteItem: (categoryId: string, itemId: string) => void;
  resetItems: (categoryId: string) => void;
  setSettings: (settings: Partial<Settings>) => void;
  setWinner: (item: PickerItem | null) => void;
};

const initialState: Omit<State, 'currentCategoryId'> = {
  categories: [],
  settings: {
    pickerType: 'wheel',
    spinTime: 5,
    showWinner: false,
    soundEnabled: true,
    confetti: true,
  },
  winner: null,
};

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      currentCategoryId: null,
      addCategory: (name) => {
        const newCategory: PickerCategory = {
          id: crypto.randomUUID(),
          name,
          items: [],
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
          currentCategoryId: newCategory.id,
        }));
      },
      editCategory: (id, name) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, name } : c
          ),
        }));
      },
      deleteCategory: (id) => {
        set((state) => {
          const newCategories = state.categories.filter((c) => c.id !== id);
          const newCurrentId =
            state.currentCategoryId === id
              ? newCategories[0]?.id ?? null
              : state.currentCategoryId;
          return {
            categories: newCategories,
            currentCategoryId: newCurrentId,
          };
        });
      },
      setCurrentCategoryId: (id) => set({ currentCategoryId: id }),
      addItem: (categoryId, name) => {
        const newItem: PickerItem = { id: crypto.randomUUID(), name };
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId ? { ...c, items: [...c.items, newItem] } : c
          ),
        }));
      },
      editItem: (categoryId, itemId, name) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  items: c.items.map((i) =>
                    i.id === itemId ? { ...i, name } : i
                  ),
                }
              : c
          ),
        }));
      },
      deleteItem: (categoryId, itemId) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
              : c
          ),
        }));
      },
      resetItems: (categoryId) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId ? { ...c, items: [] } : c
          ),
        }));
      },
      setSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      setWinner: (item) => set({ winner: item }),
    }),
    {
      name: 'random-picker-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!state.currentCategoryId && state.categories.length > 0) {
            state.currentCategoryId = state.categories[0].id;
          }
        }
      },
    }
  )
);
