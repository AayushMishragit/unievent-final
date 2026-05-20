"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { EventAPI } from "@/app/Service/authService";

import {
  Search,
  Filter,
  Trash2,
  Calendar,
  User,
  FileText,
  Ban,
} from "lucide-react";

// ─── Auth Helper ─────────────────────────────────────────────

function useAuth() {
  const raw =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  const parsed = raw ? JSON.parse(raw) : null;

  return {
    user: parsed
      ? {
          id: parsed._id ?? parsed.id,
          name: parsed.name,
        }
      : null,
  };
}

// ─── Types ──────────────────────────────────────────────────

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

// ─── Constants ──────────────────────────────────────────────

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

// ─── Component ──────────────────────────────────────────────

export default function Events() {
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");

  // loading state for disable button
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // ─── Fetch Events ────────────────────────────────────────

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await EventAPI.get("/", {
          params: { limit: 100 },
        });

        setEvents(data.events || []);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load events");
      }
    };

    fetchEvents();
  }, []);

  // ─── Filter + Search ─────────────────────────────────────

  useEffect(() => {
    let filtered = [...events];

    // search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();

      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.description.toLowerCase().includes(lower) ||
          e.createdByName.toLowerCase().includes(lower),
      );
    }

    // category filter
    if (categoryFilter && categoryFilter !== "All") {
      filtered = filtered.filter((e) => e.category === categoryFilter);
    }

    // sorting
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      return a.name.localeCompare(b.name);
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, categoryFilter, sortBy]);

  // ─── Toggle Disable ──────────────────────────────────────

  // ─── Delete Event ────────────────────────────────────────

  const deleteEvent = async (eventId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) return;

    try {
      await EventAPI.delete(`/${eventId}`);

      setEvents((prev) => prev.filter((e) => e._id !== eventId));

      toast.success("Event deleted");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete event");
    }
  };

  // ─── UI ──────────────────────────────────────────────────

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
                placeholder="Search events..."
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

          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />

            <h3 className="text-xl font-semibold text-white mb-2">
              No Events Found
            </h3>

            <p className="text-gray-400">
              {events.length === 0
                ? "You haven't created any events yet."
                : "Try changing your filters."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className={`bg-gray-800 border rounded-xl overflow-hidden transition-all group
                ${
                  event.isDisabled
                    ? "border-yellow-500/50 opacity-70"
                    : "border-gray-700 hover:border-blue-500/50"
                }`}
              >
                <div className="p-6">
                  {/* Category */}
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(
                        event.category,
                      )}`}
                    >
                      {event.category}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition">
                    {event.name}
                  </h3>

                  {/* Date + Creator */}
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

                  {/* Description */}
                  <div className="flex items-start space-x-2 text-sm text-gray-400 mb-6">
                    <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />

                    <p className="line-clamp-3">{event.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-6">
                    {/* Toggle Disable */}

                    {/* Delete */}
                    <button onClick={() => deleteEvent(event._id)}>
                      <Trash2
                        className="text-red-500 cursor-pointer"
                        size={27}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
