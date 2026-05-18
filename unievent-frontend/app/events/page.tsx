"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { EventAPI, toggleDisableEvent } from "@/app/Service/authService";

import {
  Search,
  Filter,
  Trash2,
  Calendar,
  User,
  FileText,
  AlertCircle,
  Ban,
} from "lucide-react";
//import axios from "axios";

// Replace with your real auth context import path
// import { useAuth } from '../AuthContext';
function useAuth() {
  const raw =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const parsed = raw ? JSON.parse(raw) : null;
  return {
    user: parsed ? { id: parsed._id ?? parsed.id, name: parsed.name } : null,
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Event {
  _id: string;
  name: string;
  description: string;
  category: string;
  date: string;
  createdBy: string;
  createdByName: string;
  formlink: string;
  isDisabled: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Fix: lowercase `string[]` — `String[]` is the object-wrapper type and wrong here
const CATEGORIES: string[] = [
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

const CATEGORY_COLORS: Record<string, string> = {
  Technical: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  Cultural: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  Sports: "bg-green-500/20 text-green-400 border-green-500/50",
  Workshop: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  Seminar: "bg-pink-500/20 text-pink-400 border-pink-500/50",
  Competition: "bg-red-500/20 text-red-400 border-red-500/50",
  Social: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  Other: "bg-gray-500/20 text-gray-400 border-gray-500/50",
};

function getCategoryColor(category: string): string {
  return (
    CATEGORY_COLORS[category] ??
    "bg-gray-500/20 text-gray-400 border-gray-500/50"
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Events() {
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  // Fix: type deleteConfirm as string | null instead of bare null
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [disableConfirm, setDisableConfirm] = useState<string | null>(null);

  // Fix: localStorage wrapped in useEffect — safe for Next.js SSR
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await EventAPI.get("/", { params: { limit: 100 } });
        setEvents(data.events); // same shape as ExplorePage
      } catch (err: any) {
        toast.error("Failed to load events");
      }
    };
    fetchEvents();
  }, []);

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

  const toggleDisable = async (eventId: string) => {
    try {
      const { data } = await EventAPI.patch(`/${eventId}/toggle-disable`);
      console.log(data);
      // update that event in state with the new isDisabled value from DB
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId ? { ...e, isDisabled: data.isDisabled } : e,
        ),
      );
    } catch (err: any) {
      toast.error("status:", err.response?.status);
      toast.error("data:", err.response?.data);
      toast.error("message:", err.message);
      toast.error(`toggle error${err.response?.status}, ${err.response?.data}`);
    }
  };

  // Fix: typed eventId as string

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            My Events
          </h1>
          <p className="text-gray-400">Manage all your created events</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Search Events</span>
                </div>
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name, description, or creator..."
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter by Category</span>
                </div>
              </label>
              {/* Fix: HTMLSelectElement not HTMLInputElement */}
              <select
                value={categoryFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setCategoryFilter(e.target.value)
                }
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat === "All" ? "" : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </div>

        {/* Events Display */}
        {filteredEvents.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Events Found
            </h3>
            <p className="text-gray-400">
              {events.length === 0
                ? "You haven't created any events yet. Go to your dashboard to create one!"
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(event.category)}`}
                    >
                      {event.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition">
                    {event.name}
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{event.createdByName}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 text-sm text-gray-400 mb-4">
                    <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-3">{event.description}</p>
                  </div>

                  {/* Fix: user?.id null-checked */}
                  <button
                    className="py-4"
                    onClick={() => toggleDisable(event._id)}
                  >
                    <Ban
                      className={
                        event.isDisabled === true
                          ? "text-yellow-400 cursor-pointer"
                          : "text-gray-400 coursor-pointer"
                      }
                      size={27}
                    />
                  </button>
                  <button
                    className="py-4 px-7"
                    onClick={async () => {
                      const confirmed = window.confirm(
                        "Are you sure you want to delete?",
                      );
                      if (!confirmed) return;

                      try {
                        await EventAPI.delete(`/${event._id}`);
                        setEvents((prev) =>
                          prev.filter((e) => e._id !== event._id),
                        );
                      } catch {
                        toast.error("Failed to delete event");
                      }
                    }}
                  >
                    <Trash2 className="text-red-500 cursor-pointer" size={27} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
