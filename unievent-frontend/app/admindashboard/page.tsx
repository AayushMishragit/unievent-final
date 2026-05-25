"use client";

import React, { useState, useEffect } from "react";
import { googleFormUtils } from "../utils/googleformUtils";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Search,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  Ban,
  Activity,
  Tag,
  LayoutGrid,
  Flame,
  CheckCircle,
} from "lucide-react";

function useAuth() {
  return { isAuthenticated: false };
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Event {
  _id: string;
  name: string;
  description: string;
  category: string;
  date: string;
  formlink: string;
  isDisabled: boolean;
  createdByName: string;
  interestedCount: number;
}

type ActiveTab = "all" | "trending";

// ─── Axios instance (unchanged from original) ─────────────────────────────────

const EventAPI = axios.create({
  baseURL: "http://localhost:5000/api/events",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

EventAPI.interceptors.request.use((config) => {
  const raw = localStorage.getItem("user");
  if (raw) {
    const parsed = JSON.parse(raw);
    if (parsed?.token) config.headers.Authorization = `Bearer ${parsed.token}`;
  }
  return config;
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_BADGE: Record<string, string> = {
  Technical: "bg-blue-500/20   text-blue-400   border border-blue-500/40",
  Cultural: "bg-purple-500/20  text-purple-400  border border-purple-500/40",
  Sports: "bg-green-500/20  text-green-400  border border-green-500/40",
  Workshop: "bg-orange-500/20 text-orange-400 border border-orange-500/40",
  Seminar: "bg-pink-500/20   text-pink-400   border border-pink-500/40",
  Competition: "bg-red-500/20    text-red-400    border border-red-500/40",
  Social: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
  Other: "bg-gray-500/20   text-gray-400   border border-gray-500/40",
};

function badge(category: string) {
  return CATEGORY_BADGE[category] ?? CATEGORY_BADGE["Other"];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");

  // ── Fetch events (unchanged from original) ────────────────────────────────
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await EventAPI.get("/", { params: { limit: 100 } });
        const hydrated: Event[] = data.events.map(
          (e: Omit<Event, "interestedCount">) => ({
            ...e,
            interestedCount: Math.floor(Math.random() * 200 + 50),
          }),
        );
        setEvents(hydrated);
      } catch {
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ── Filter + sort (unchanged from original) ───────────────────────────────
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
      if (sortBy === "date")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    setFilteredEvents(filtered);
  }, [searchTerm, categoryFilter, sortBy, events]);

  // ── Derived stats (same data, admin-style counters) ───────────────────────
  const today = new Date();
  const activeEvents = events.filter(
    (e) => new Date(e.date) >= today && !e.isDisabled,
  ).length;
  const disabledCount = events.filter((e) => e.isDisabled).length;
  const categoryCount: Record<string, number> = {};
  events.forEach((e) => {
    categoryCount[e.category] = (categoryCount[e.category] ?? 0) + 1;
  });

  const trendingEvents = filteredEvents.slice(0, 3);
  const displayEvents =
    activeTab === "trending" ? trendingEvents : filteredEvents;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <LayoutGrid className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Explore Events</h1>
              <p className="text-gray-400">Browse and discover campus events</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* ── Stat Cards ── */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-blue-400" />
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {events.length}
            </div>
            <div className="text-blue-300 text-sm">Total Events</div>
          </div>

          <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 border border-green-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {activeEvents}
            </div>
            <div className="text-green-300 text-sm">Active Events</div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 border border-orange-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Tag className="w-8 h-8 text-orange-400" />
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {Object.keys(categoryCount).length}
            </div>
            <div className="text-orange-300 text-sm">Categories</div>
          </div>
        </div>

        {/* ── Main Panel where all details get shown── */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl mb-6">
          {/* Tabs + search + sort bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-700 px-6 gap-3">
            {/* Tabs */}
            <div className="flex">
              {(
                [
                  {
                    key: "all",
                    label: `All Events (${filteredEvents.length})`,
                    icon: <LayoutGrid className="w-4 h-4" />,
                  },
                  {
                    key: "trending",
                    label: "Trending",
                    icon: <Flame className="w-4 h-4" />,
                  },
                ] as { key: ActiveTab; label: string; icon: React.ReactNode }[]
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-4 font-semibold transition ${
                    activeTab === tab.key
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search + sort */}
            <div className="flex items-center gap-3 pb-3 md:pb-0">
              <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events..."
                  className="bg-transparent text-white text-sm focus:outline-none w-44"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "name")}
                className="bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-gray-700">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat === "All" ? "" : cat)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  (cat === "All" && !categoryFilter) || categoryFilter === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Table body ── */}
          <div className="p-6">
            {/* Loading */}
            {loading && (
              <div className="text-center py-16">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading events...</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && displayEvents.length === 0 && (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  No Events Found
                </h3>
                <p className="text-gray-400">
                  {events.length === 0
                    ? "No events created yet."
                    : "Try adjusting your search or filters."}
                </p>
              </div>
            )}

            {/* Table */}
            {!loading && !error && displayEvents.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900 border-b border-gray-700">
                    <tr>
                      {[
                        "Event Name",
                        "Category",
                        "Date",
                        "Organiser",
                        "Interested",
                        "Status",
                        "Responses",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-sm font-semibold text-gray-300"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {displayEvents.map((event) => (
                      <tr
                        key={event._id}
                        className="hover:bg-gray-900/50 transition"
                      >
                        {/* Name + description */}
                        <td className="px-4 py-4 max-w-xs">
                          <div className="text-white font-semibold">
                            {event.name}
                          </div>
                          <div className="text-gray-400 text-xs mt-1 line-clamp-1">
                            {event.description}
                          </div>
                        </td>

                        {/* Category badge */}
                        <td className="px-4 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${badge(event.category)}`}
                          >
                            {event.category}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-4 text-gray-300 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            {formatDate(event.date)}
                          </div>
                        </td>

                        {/* Organiser */}
                        <td className="px-4 py-4 text-gray-300 text-sm">
                          {event.createdByName}
                        </td>

                        {/* Interested count */}
                        <td className="px-4 py-4 text-gray-300 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-500" />
                            {event.interestedCount}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          {event.isDisabled ? (
                            <span className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded text-xs font-semibold w-fit">
                              <Ban className="w-3 h-3" /> Disabled
                            </span>
                          ) : new Date(event.date) >= new Date() ? (
                            <span className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded text-xs font-semibold w-fit">
                              <Activity className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/30 rounded text-xs font-semibold w-fit">
                              Ended
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-4 py-4">
                          {event.isDisabled ? (
                            <span className="text-gray-600 text-sm">—</span>
                          ) : (
                            <a
                              href={googleFormUtils(event.formlink) ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm font-semibold transition"
                            >
                              Responses <ArrowRight className="w-3 h-3" />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Category Distribution (mirrors Admin Overview) ── */}
        {!loading && !error && Object.keys(categoryCount).length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Category Distribution
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(categoryCount).map(([category, count]) => (
                <div
                  key={category}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${badge(category)}`}
                    >
                      {category}
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {count}
                    </span>
                  </div>
                  <div className="mt-3 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2 transition-all"
                      style={{
                        width: `${events.length > 0 ? (count / events.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── CTA Banner (unchanged) ── */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 border-t border-gray-800 mt-8">
          <div className="container mx-auto px-4 py-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to create your own event?
            </h3>
            <p className="text-blue-100 mb-6">
              Join UniEvent today and start organising amazing campus
              experiences
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
