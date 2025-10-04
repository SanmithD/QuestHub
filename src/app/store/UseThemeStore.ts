import { create } from "zustand";

interface ThemeDetails {
  theme: string;
  setTheme: (newTheme: string) => void;
}

export const UseThemeStore = create<ThemeDetails>((set) => ({
  theme: "light",
  setTheme: (newTheme) => {
    set({ theme: newTheme });
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  },
}));
