"use client";

import { UseThemeStore } from "@/app/store/UseThemeStore";
import { useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = UseThemeStore((state) => state.theme);
  const setTheme = UseThemeStore((state) => state.setTheme);

  // On mount, sync theme with localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}
