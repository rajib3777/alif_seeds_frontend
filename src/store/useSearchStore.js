import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  searchQuery: '',
  selectedCategory: '',
  hasNoResults: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (cat) => set({ selectedCategory: cat }),
  setHasNoResults: (val) => set({ hasNoResults: val }),
}));
