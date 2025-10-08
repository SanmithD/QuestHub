"use client";

import {
  Bookmark,
  Menu,
  Moon,
  SearchIcon,
  Sun,
  Trophy,
  User2,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UseQuestStore } from "../store/UseQuestStore";
import { UseThemeStore } from "../store/UseThemeStore";

function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // state to reflect auth status (session or jwt cookie)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const theme = UseThemeStore((state) => state.theme);
  const setTheme = UseThemeStore((state) => state.setTheme);
  const fetchQuest = UseQuestStore((state) => state.getAllQuests);

  useEffect(() => {
    setMounted(true);
  }, []);

  // update auth state whenever session changes
  useEffect(() => {
    if (!mounted) return;

    // check cookie manually
    const hasJwt =
      typeof document !== "undefined" &&
      document.cookie.split("; ").some((row) => row.startsWith("jwt="));

    setIsAuthenticated(Boolean(session?.user?.email || hasJwt));
  }, [mounted, session]);

  const navItems = [
    { name: "Search", icon: <SearchIcon />, href: "/pages/Search" },
    { name: "Top Rank", icon: <Trophy />, href: "/pages/Rank" },
    { name: "Bookmark", icon: <Bookmark />, href: "/pages/Quest/Book" },
    { name: "Profile", icon: <User2 />, href: "/pages/User" },
  ];

  if (!mounted) return null;

  const handleHome = async () => {
    router.push("/");
    await fetchQuest(1, 20);
  };

  const handleSignOut = async () => {
    try {
      // clear jwt cookie
      document.cookie =
        "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // sign out next-auth session if present
      if (session) {
        await signOut({ redirect: false });
      }

      setIsAuthenticated(false);
      router.push("/pages/Login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="mx-auto flex justify-between items-center px-4 md:px-12 py-3 border-b ">
      <div
        className="text-xl flex items-center font-bold cursor-pointer rounded-full "
        onClick={handleHome}
      >
        <Image
          src="/QuestLogo1.png"
          alt="logo"
          height={50}
          width={50}
          className="md:w-[70px] md:h-[70px]"
        />
        <span className="text-2xl font-bold tracking-wide">Quest Hub</span>
      </div>

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

        {isAuthenticated ? (
          <button
            onClick={() => {
              handleSignOut();
              setIsOpen(false);
            }}
            className="px-4 rounded-md bg-red-400 py-2 text-white cursor-pointer hover:bg-red-500 active:bg-red-700"
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={() => router.push("/pages/Signup")}
            className="px-4 rounded-md bg-green-500 py-2 text-white cursor-pointer hover:bg-green-600 active:bg-green-700"
          >
            Sign In
          </button>
        )}
      </div>

      <div className="block items-center md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-500 shadow-md flex flex-col items-center py-4 gap-4 md:hidden font-medium z-50">
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

          {isAuthenticated ? (
            <button
              onClick={() => {
                handleSignOut();
                setIsOpen(false);
              }}
              className="px-4 rounded-md bg-red-400 py-2 text-white cursor-pointer hover:bg-red-500 active:bg-red-700"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => {
                router.push("/pages/Signup");
                setIsOpen(false);
              }}
              className="px-4 rounded-md bg-green-500 py-2 text-white cursor-pointer hover:bg-green-600 active:bg-green-700"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;
