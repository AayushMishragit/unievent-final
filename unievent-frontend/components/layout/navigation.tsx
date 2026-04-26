"use client";
import { Activity, Menu } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <nav>
      <header className="h-16 border-b p-4 bg-black flex items-center justify-between border-gray-800">

        {/* Logo + Title */}
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-violet-600 rounded-md flex items-center justify-center ml-8">
            <Activity size={17} color="white" strokeWidth={2} />
          </div>

          <h1
            className="text-2xl font-bold text-violet-700 tracking-tight cursor-pointer"
            onClick={() => router.push("/")}
          >
            UniEvent
          </h1>

          <span
            onClick={() => router.push("/about")}
            className="px-4 py-2 text-white md:flex hidden text-sm cursor-pointer"
          >
            Explore
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center text-white font-light text-sm ml-auto">

          {/* ✅ LOGIN FIX */}
          <span
            onClick={() => router.push("/auth?mode=login")}
            className="cursor-pointer"
          >
            Log in
          </span>

          {/* ✅ SIGNUP FIX */}
          <span
            onClick={() => router.push("/auth?mode=signup")}
            className="bg-gradient-to-t from-sky-500 to-indigo-500 rounded-md px-3 py-2 cursor-pointer"
          >
            Sign up
          </span>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="flex flex-col bg-black text-white font-light text-sm md:hidden">

          <span
            onClick={() => router.push("/about")}
            className="px-4 py-2 border-b cursor-pointer"
          >
            Explore
          </span>

          <span
            onClick={() => router.push("/auth?mode=login")}
            className="px-4 py-2 border-b cursor-pointer"
          >
            Log in
          </span>

          <span
            onClick={() => router.push("/auth?mode=signup")}
            className="px-4 py-2 bg-gradient-to-t from-sky-500 to-indigo-500 rounded-md m-2 text-center cursor-pointer"
          >
            Sign up
          </span>

        </div>
      )}
    </nav>
  );
}