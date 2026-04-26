"use client";
import React from "react";
import Navigation from "../components/layout/navigation";
import {
  Sparkles,
  Globe,
  ArrowRight,
  PlusSquare,
  TrendingUp,
  Zap,
  MapPin,
  Users2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Navigation />

      <div className="flex flex-col items-center min-h-screen w-full text-violet-500 p-3 bg-black">

        {/* Top Pill */}
        <div className="flex items-center h-8 px-6 border border-violet-700 rounded-full text-sm mt-4">
          <Sparkles size={18} className="mr-2" />
          <p>University-Wide Events Portal</p>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-center font-extrabold text-white text-3xl sm:text-6xl">
          Discover, Join &{" "}
          <span className="text-blue-600">Create Events</span> Across Campus
        </h1>

        {/* Subtext */}
        <p className="text-white mt-6 text-center text-sm sm:text-lg max-w-xl">
          The ultimate hub for university events. Connect with your community,
          explore workshops, find parties, and organize your own experiences
          with ease.
        </p>

        {/* 🔥 CTA BUTTONS */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push("/auth?mode=signup")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium flex items-center gap-2"
          >
            Get Started <ArrowRight size={16} />
          </button>

          <button
            onClick={() => router.push("/auth?mode=login")}
            className="px-6 py-3 rounded-lg border border-white/20 text-white"
          >
            Browse Events
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-16">

          {/* Explore */}
          <div className="p-7 bg-white/5 backdrop-blur-lg border border-white/5 rounded-md w-80 sm:w-105 mx-auto space-y-2 hover:scale-105 transition">
            <div className="w-10 h-10 bg-violet-800/30 flex items-center justify-center rounded-md">
              <Globe size={22} className="text-violet-600" />
            </div>

            <h3 className="text-white text-xl font-bold text-center">
              Explore Events
            </h3>

            <p className="text-gray-400 text-sm">
              Browse through hundreds of upcoming campus activities.
            </p>

            <button
              onClick={() => router.push("/auth?mode=login")}
              className="w-full mt-4 py-2 rounded-sm bg-gradient-to-r from-indigo-500 to-purple-400 text-white flex justify-center items-center gap-2"
            >
              Browse Calendar <ArrowRight size={16} />
            </button>
          </div>

          {/* Create */}
          <div className="p-7 bg-white/5 backdrop-blur-lg border border-white/5 rounded-md w-80 sm:w-105 mx-auto space-y-2 hover:scale-105 transition">
            <div className="w-10 h-10 flex items-center justify-center rounded-md">
              <PlusSquare size={22} className="text-white" />
            </div>

            <h3 className="text-white text-xl font-bold text-center">
              Create Event
            </h3>

            <p className="text-gray-400 text-sm">
              Empower your organization and create events.
            </p>

            <button
              onClick={() => router.push("/auth?mode=signup")}
              className="w-full mt-4 py-2 rounded-sm bg-gradient-to-r from-blue-500 to-blue-300 text-white flex justify-center items-center gap-2"
            >
              Get Started <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col items-center mt-20">
          <h1 className="text-white text-2xl sm:text-3xl font-bold">
            Why Choose UniEvent
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-violet-400 to-black mt-4" />
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-4 gap-8">

          {[ 
            { icon: TrendingUp, title: "Smart Discovery", text: "Personalized event recommendations." },
            { icon: Zap, title: "Instant Registration", text: "One-click RSVP system." },
            { icon: MapPin, title: "Live Campus Map", text: "See events across campus." },
            { icon: Users2, title: "Verified Organizers", text: "Trusted university groups." }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-md w-60 sm:w-70">
              <div className="w-10 h-10 bg-blue-900/30 flex items-center justify-center rounded-full mb-3">
                <item.icon size={20} className="text-violet-600" />
              </div>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.text}</p>
            </div>
          ))}

        </div>
      </div>
    </>
  );
}