// src/app/layout.tsx
"use client";

import Navbar from "@/components/Navbar";
import "../styles/globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login" || pathname === "/register";

  return (
    <html lang="pt-BR">
      <body className="bg-gray-100">
        {!hideNavbar && <Navbar />}
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
