"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  Search,
  Plus,
  Target,
  Shield,
  ShieldQuestionMark,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
// Replace this with your actual auth context import path
// import { useAuth } from '../AuthContext';

// Temporary stub — swap out for your real useAuth hook

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storeduser = localStorage.getItem("user");

    if (storeduser) {
      const parsed = JSON.parse(storeduser);
      setUser(parsed.user);
    }
  }, []);
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const features = [
    {
      icon: Search,
      title: "Smart Discovery",
      description:
        "Find events tailored to your interests with intelligent search and recommendations",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Calendar,
      title: "Instant Registration",
      description:
        "Sign up for events instantly with our streamlined booking system",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Target,
      title: "Live Campus Map",
      description:
        "Never miss an event with real-time location tracking and notifications",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: Shield,
      title: "Verified Organizers",
      description:
        "All events are hosted by verified students and official campus organizations",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const stats = [
    { value: "12k+", label: "Active Students" },
    { value: "850+", label: "Events Hosted" },
    { value: "150+", label: "Student Clubs" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <>
      <div className="bg-gray-900 min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />

          <div className="container mx-auto px-4 py-20 relative">
            <div className="text-center max-w-5xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">
                  Powering university events &amp; connections
                </span>
              </div>

              {/* Main heading */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Discover, Join &amp;
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  Create Events
                </span>
                <br />
                Across Campus
              </h1>

              <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
                The ultimate hub for university events. Connect with your
                community, explore workshops, find parties, and organize your
                own experiences with ease.
              </p>

              {/* CTA Cards */}
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
                {/* Explore Events Card */}
                <div
                  className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all group cursor-pointer"
                  onClick={() => {
                    if (isAdmin) {
                      router.push("/createevent");
                    } else {
                      router.push("/explorepage");
                    }
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-500/10 p-4 rounded-xl group-hover:bg-blue-500/20 transition">
                      <Search className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {!isAuthenticated
                      ? "Explore Events"
                      : isAdmin
                        ? "Create Event"
                        : "Browse Events"}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {!isAuthenticated
                      ? "Browse through all upcoming campus events, workshops, and social gatherings happening this week"
                      : isAdmin
                        ? "Create and publish new university events for students"
                        : "Explore all available campus events and activities"}
                  </p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition cursor-pointer">
                    <span>
                      {" "}
                      {!isAuthenticated
                        ? "Discover College Events"
                        : isAdmin
                          ? "Create Event"
                          : "Browse Events"}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Create Event Card */}
                {/* Dynamic Second Card */}
                <div
                  className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all group cursor-pointer"
                  onClick={() => {
                    if (!isAuthenticated) {
                      router.push("/auth?mode=signup");
                    } else if (isAdmin) {
                      router.push("/admindashboard");
                    } else {
                      router.push("/promotionpage");
                    }
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-purple-500/10 p-4 rounded-xl group-hover:bg-purple-500/20 transition">
                      <ShieldQuestionMark className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    {!isAuthenticated
                      ? "Let's Get Started"
                      : isAdmin
                        ? "Manage Events"
                        : "About Unievent"}
                  </h3>

                  <p className="text-gray-400 mb-6">
                    {!isAuthenticated
                      ? "Organize your next event, workshop or club."
                      : isAdmin
                        ? "Manage and monitor all created events from admin dashboard"
                        : "See why you should join the unievent"}
                  </p>

                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition">
                    <span>
                      {!isAuthenticated
                        ? "Get Started"
                        : isAdmin
                          ? "Manage Events"
                          : "Learn more"}
                    </span>

                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Students Love UniEvent */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Students Love UniEvent
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all group"
              >
                <div className="mb-4">
                  <div
                    className={`bg-gradient-to-br ${feature.color} p-3 rounded-lg inline-block`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-y border-gray-800">
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 uppercase text-sm tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already making the most of
              their college life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <a
                    onClick={() => router.push("/auth?mode=signup")}
                    className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
                  >
                    Sign Up Free
                  </a>
                  <a
                    onClick={() => router.push("/auth?mode=login")}
                    className="px-8 py-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-semibold text-lg border-2 border-white"
                  >
                    Log In
                  </a>
                </>
              ) : (
                <a
                  href="/dashboard"
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
                >
                  Go to Dashboard
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 bg-gray-950">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <span className="text-xl font-bold text-white">UniEvent</span>
                </div>
                <p className="text-gray-400 text-sm">
                  The ultimate hub for university events. Connect, explore, and
                  create unforgettable campus experiences.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Platform</h4>
                <ul className="space-y-2">
                  <li>
                    <span
                      onClick={() => router.push("/explorepage")}
                      className="text-gray-400 hover:text-white transition cursor-pointer"
                    >
                      Explore Events
                    </span>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Community
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Discord
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
              <p>© 2026 UniEvent. Made for the student community.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
