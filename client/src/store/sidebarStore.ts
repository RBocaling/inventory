import { create } from "zustand";

type SidebarState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebar: (value: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebar: (value: boolean) => set({ isSidebarOpen: value }),
}));
