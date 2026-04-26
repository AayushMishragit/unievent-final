"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import UserSignupForm  from "./UserSignupForm";
import AdminSignupForm from "./AdminSignupForm";
import UserLoginForm   from "./UserLoginForm";
import AdminLoginForm  from "./AdminLoginForm";

export default function AuthTabs() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const queryMode = searchParams.get("mode");
  const [mode, setMode] = useState<"signup" | "login">(
    queryMode === "login" ? "login" : "signup"
  );

  const [role, setRole] = useState<"user" | "admin">("user");

  const handleSetMode = (newMode: "signup" | "login") => {
    setMode(newMode);
    router.push(`/auth?mode=${newMode}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[420px] bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">

        {/* Logo */}
        <div className="text-center mb-4">
          <p className="text-purple-400 font-semibold tracking-widest uppercase text-sm">
            UniEvent
          </p>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-white mb-1">
          {mode === "signup"
            ? role === "admin" ? "Join as Organizer" : "Create your account"
            : "Welcome Back"}
        </h1>

        <p className="text-center text-gray-400 text-sm mb-6">
          {mode === "signup"
            ? "Join the university's vibrant event hub"
            : "Connect with your university community"}
        </p>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {role === "admin" ? "📅" : "🎓"}
            </div>
            <div className="absolute bottom-0 right-0 bg-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm cursor-pointer hover:bg-purple-500 transition">
              +
            </div>
          </div>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-white/5 p-1 rounded-xl mb-4">
          <button
            onClick={() => setRole("user")}
            className={`flex-1 py-2 rounded-lg text-sm transition-all ${
              role === "user"
                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🎓 Student
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 rounded-lg text-sm transition-all ${
              role === "admin"
                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📅 Organizer
          </button>
        </div>

        {/* Mode Toggle (Login / Signup) */}
        <div className="flex bg-white/5 p-1 rounded-xl mb-6">
          <button
            onClick={() => handleSetMode("signup")}
            className={`flex-1 py-2 rounded-lg text-sm transition-all ${
              mode === "signup"
                ? "bg-white/10 text-white font-medium"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => handleSetMode("login")}
            className={`flex-1 py-2 rounded-lg text-sm transition-all ${
              mode === "login"
                ? "bg-white/10 text-white font-medium"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Log In
          </button>
        </div>

        {/* Forms */}
        {mode === "signup" ? (
          role === "user" ? (
            <UserSignupForm  setMode={handleSetMode} />
          ) : (
            <AdminSignupForm setMode={handleSetMode} />
          )
        ) : role === "user" ? (
          <UserLoginForm  setMode={handleSetMode} />
        ) : (
          <AdminLoginForm setMode={handleSetMode} />
        )}

      </div>
    </div>
  );
}