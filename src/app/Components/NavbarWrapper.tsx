// app/Components/NavbarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide Navbar on login and signup pages
  if (pathname === "/pages/Login" || pathname === "/pages/Signup") {
    return null;
  }

  return <Navbar />;
}
