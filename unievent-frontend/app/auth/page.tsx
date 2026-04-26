import { Suspense } from "react";
import AuthTabs from "./components/AuthTabs";

export default function AuthPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#070b14] overflow-hidden">

      {/* LEFT GLOW */}
      <div className="absolute -left-40 top-20 w-[500px] h-[500px] bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-30 blur-[120px] rounded-full" />

      {/* RIGHT GLOW */}
      <div className="absolute -right-40 bottom-20 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-30 blur-[120px] rounded-full" />

      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-5xl mx-auto p-6">

        <div className="flex justify-center">
          <Suspense fallback={
            <div className="w-[420px] h-[500px] bg-[#0f172a]/80 rounded-2xl flex items-center justify-center">
              <div className="text-purple-400 animate-pulse">Loading...</div>
            </div>
          }>
            <AuthTabs />
          </Suspense>
        </div>

        {/* FOOTER */}
        <div className="text-center text-gray-500 text-sm mt-10">
          © 2024 UniEvent. All rights reserved. · Privacy · Terms · Contact
        </div>

      </div>
    </div>
  );
}