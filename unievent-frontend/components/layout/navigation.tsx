"use client";
import { Activity, Menu } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const openmenu = () => {
    setOpen(!isOpen);
  };

  const handlelogout = () => {
    localStorage.removeItem("user");
    router.push("/");
    window.location.reload();
  };

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
            onClick={() => router.push("/explorepage")}
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
          <details className="relative">
            <summary className="list-none cursor-pointer">
              <Image
                alt="avatar"
                width={40}
                height={40}
                src="/avatar.jpg"
                className="w-10 h-10 rounded-full mx-1"
              />
            </summary>

            <div
              className="absolute -left-20 mt-2 w-40 
               bg-white/20 backdrop-blur-md 
               border border-white/30 
               rounded-lg shadow-lg p-2 z-20"
            >
              <span
                onClick={handlelogout}
                className="transition ease-in-out duration-150 
                 block text-white px-4 py-2 
                 bg-gradient-to-t from-sky-500 to-indigo-500 
                 rounded-md text-center hover:opacity-90 
                 cursor-pointer"
              >
                Logout
              </span>
            </div>
          </details>
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
            onClick={() => router.push("/explorepage")}
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
          <button onClick={openmenu}>
            <Image
              alt="avatar"
              width={10}
              height={10}
              src="/avatar.jpg"
              className="w-10 h-10 rounded-full m-4"
            />
          </button>

          <span
            onClick={handlelogout}
            className="text-white px-4 py-2 bg-gradient-to-t from-sky-500 to-indigo-500 rounded-md m-2 text-center cursor-pointer"
          >
            Logout
          </span>
        </div>
      )}
    </nav>
  );
}
