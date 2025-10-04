"use client";

import { Bookmark, Menu, Moon, SearchIcon, Sun, Trophy, User2, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UseThemeStore } from "../store/UseThemeStore";

function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false); 

  const theme = UseThemeStore((state) => state.theme);
  const setTheme = UseThemeStore((state) => state.setTheme);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Search", icon: <SearchIcon />, href: "/search" },
    { name: "Top Rank", icon: <Trophy />, href: "/top-rank" },
    { name: "Bookmark", icon: <Bookmark />, href: "/pages/Quest/Book" },
    { name: "Profile", icon: <User2 />, href: "/pages/User" },
  ];

  if (!mounted) return null;

  return (
    <div className="mx-auto flex justify-between items-center px-4 md:px-12 py-3 border-b ">
      <div className="text-xl font-bold cursor-pointer px-3 py-1 border rounded-md " onClick={()=>router.push('/')} >Logo</div>

      <div className="hidden md:flex justify-center gap-8 items-center py-3 font-medium">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col justify-center items-center cursor-pointer hover:text-sky-500"
          >
            {item.icon}
            {item.name}
          </Link>
        ))}

        <button
          className="cursor-pointer hover:text-sky-700"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        <button
          onClick={() => signOut()}
          className="px-4 rounded-md bg-red-400 py-2 text-white cursor-pointer hover:bg-red-500 active:bg-red-700"
        >
          Sign out
        </button>
      </div>

      <div className="block items-center md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 gap-4 md:hidden font-medium z-50">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex gap-2 items-center cursor-pointer hover:text-sky-500"
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}

          <button
            onClick={() => {
              setIsOpen(false);
              signOut();
            }}
            className="px-4 rounded-md bg-red-400 py-2 text-white cursor-pointer hover:bg-red-500 active:bg-red-700"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
