"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!isLoggedIn) return null;

  return (
    <nav className="flex justify-between items-center bg-blue-600 p-4 text-white">
      <div>
        <Link href="/products" className="mr-4 hover:underline">
          Produtos
        </Link>
        <Link href="/modify-prices" className="mr-4 hover:underline">
          Modificar Preços
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
