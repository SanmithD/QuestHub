import { create } from "zustand";

interface ThemeDetails {
  theme: string;
  setTheme: (newTheme: string) => void;
}

const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("theme") || "light";
  }
  return "light"; 
};

export const UseThemeStore = create<ThemeDetails>((set) => ({
  theme: getInitialTheme(),

  setTheme: (newTheme) => {
    set({ theme: newTheme });

    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  },
}));
