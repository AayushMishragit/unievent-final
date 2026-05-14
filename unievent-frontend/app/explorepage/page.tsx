"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

// Replace with your real auth context import
// import { useAuth } from '../AuthContext';
function useAuth() {
  return { isAuthenticated: false };
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  date: string;
  /** Pre-computed on load so it's stable across renders (avoids hydration mismatch). */
  interestedCount: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Technical: "from-blue-500 to-blue-600",
  Cultural: "from-purple-500 to-purple-600",
  Sports: "from-green-500 to-green-600",
  Workshop: "from-orange-500 to-orange-600",
  Seminar: "from-pink-500 to-pink-600",
  Competition: "from-red-500 to-red-600",
  Social: "from-yellow-500 to-yellow-600",
  Other: "from-gray-500 to-gray-600",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "from-gray-500 to-gray-600";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const CATEGORIES = [
  "All",
  "Technical",
  "Cultural",
  "Sports",
  "Workshop",
  "Seminar",
  "Competition",
  "Social",
  "Other",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");

  // ── Load events from localStorage (client-only) ───────────────────────────
  useEffect(() => {
    const raw: Omit<Event, "interestedCount">[] = JSON.parse(
      localStorage.getItem("events") ?? "[]",
    );
    // Attach a stable random count here so it never changes between renders
    const hydrated: Event[] = raw.map((e) => ({
      ...e,
      interestedCount: Math.floor(Math.random() * 200 + 50),
    }));
    setEvents(hydrated);
  }, []);

  // ── Filter + sort whenever dependencies change ────────────────────────────
  useEffect(() => {
    let filtered = [...events];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.description.toLowerCase().includes(lower),
      );
    }

    if (categoryFilter && categoryFilter !== "All") {
      filtered = filtered.filter((e) => e.category === categoryFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === "date") {
        // Fix: convert to timestamps (numbers) before subtracting
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    setFilteredEvents(filtered);
  }, [searchTerm, categoryFilter, sortBy, events]);

  const trendingEvents = filteredEvents.slice(0, 3);
  const upcomingEvents = filteredEvents.slice(3);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-b border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore Campus Events
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Discover amazing events happening across your campus
            </p>

            {/* Search Bar */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-2 flex items-center">
              <Search className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search events, workshops, parties..."
                className="flex-1 bg-transparent text-white px-4 py-3 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat === "All" ? "" : cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    (cat === "All" && !categoryFilter) || categoryFilter === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown — fix: HTMLSelectElement, not HTMLInputElement */}
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSortBy(e.target.value as "date" | "name")
              }
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              No Events Found
            </h3>
            <p className="text-gray-400 mb-6">
              {events.length === 0
                ? "No events have been created yet. Be the first to create one!"
                : "Try adjusting your search or filters."}
            </p>
            {isAuthenticated && (
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Create Event
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Trending Section */}
            {trendingEvents.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">
                      Trending Now
                    </h2>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {filteredEvents.length} events available
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {trendingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group cursor-pointer"
                    >
                      {/* Image Placeholder */}
                      <div
                        className={`h-48 bg-gradient-to-br ${getCategoryColor(event.category)} flex items-center justify-center`}
                      >
                        <Calendar className="w-16 h-16 text-white opacity-50" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(event.category)} text-white`}
                          >
                            {event.category}
                          </span>
                          <div className="flex items-center space-x-1 text-gray-400 text-sm">
                            <Users className="w-4 h-4" />
                            <span>125 going</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
                          {event.name}
                        </h3>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>

                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Main Campus Hall</span>
                          </div>
                        </div>

                        <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center space-x-2">
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Events Grid */}
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  All Events
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(event.category)} text-white`}
                        >
                          {event.category}
                        </span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {new Date(event.date).getDate()}
                          </div>
                          <div className="text-xs text-gray-400 uppercase">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition">
                        {event.name}
                      </h3>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          {/* Fix: use stable pre-computed value instead of Math.random() in render */}
                          <span>{event.interestedCount} interested</span>
                        </div>
                        <button className="text-blue-400 hover:text-blue-300 font-semibold">
                          Learn More →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Banner */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 border-t border-gray-800">
          <div className="container mx-auto px-4 py-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to create your own event?
            </h3>
            <p className="text-blue-100 mb-6">
              Join UniEvent today and start organizing amazing campus
              experiences
            </p>
            <button
              onClick={() => router.push("/auth?mode=signup")}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold cursor-pointer"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
