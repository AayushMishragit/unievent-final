"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Shield,
  Users,
  Calendar,
  Trash2,
  AlertCircle,
  TrendingUp,
  Activity,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  phone: string;
  createdAt: string;
}

interface Event {
  id: string;
  name: string;
  category: string;
  date: string;
  createdBy: string;
  createdByName: string;
}

interface Stats {
  totalUsers: number;
  totalEvents: number;
  activeEvents: number;
  // Fix: properly typed — Object.entries returns [string, number][] with this
  categories: Record<string, number>;
}

// Fix: strict union instead of bare string — prevents invalid tab values
type ActiveTab = "overview" | "users" | "events";

// Fix: proper discriminated union for deleteConfirm — id is string when set, null when cleared
type DeleteConfirm =
  | { type: "user" | "event"; id: string }
  | { type: null; id: null };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEvents: 0,
    activeEvents: 0,
    categories: {},
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm>({
    type: null,
    id: null,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await EventAPI.get("/", {
          params: { limit: 100 }, // fetch all, filter client-side to keep your existing UX
        });
        const hydrated: Event[] = data.events.map(
          (e: Omit<Event, "interestedCount">) => ({
            ...e,
            interestedCount: Math.floor(Math.random() * 200 + 50),
          }),
        );
        setEvents(hydrated);
        setEvents(hydrated);
      } catch {
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fix: localStorage wrapped in useEffect — safe for Next.js SSR
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedUsers: User[] = JSON.parse(
      localStorage.getItem("users") ?? "[]",
    );
    const storedEvents: Event[] = JSON.parse(
      localStorage.getItem("events") ?? "[]",
    );

    setUsers(storedUsers);
    setEvents(storedEvents);

    const categoryCount: Record<string, number> = {};
    storedEvents.forEach((event) => {
      categoryCount[event.category] = (categoryCount[event.category] ?? 0) + 1;
    });

    const today = new Date();
    const activeEvents = storedEvents.filter(
      (event) => new Date(event.date) >= today,
    ).length;

    setStats({
      totalUsers: storedUsers.length,
      totalEvents: storedEvents.length,
      activeEvents,
      categories: categoryCount,
    });
  };

  // Fix: typed userId as string
  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    const updatedEvents = events.filter((e) => e.createdBy !== userId);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    loadData();
    setDeleteConfirm({ type: null, id: null });
  };

  // Fix: typed eventId as string
  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = events.filter((e) => e.id !== eventId);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    loadData();
    setDeleteConfirm({ type: null, id: null });
  };

  // Fix: id is guaranteed non-null here via the discriminated union type
  const handleConfirmDelete = () => {
    if (!deleteConfirm.type) return;
    if (deleteConfirm.type === "user") handleDeleteUser(deleteConfirm.id);
    if (deleteConfirm.type === "event") handleDeleteEvent(deleteConfirm.id);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3">
            <div className="bg-red-500/10 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">
                Manage users, events, and platform analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalUsers}
            </div>
            <div className="text-blue-300 text-sm">Total Users</div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-purple-400" />
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalEvents}
            </div>
            <div className="text-purple-300 text-sm">Total Events</div>
          </div>

          <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 border border-green-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.activeEvents}
            </div>
            <div className="text-green-300 text-sm">Active Events</div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 border border-orange-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-orange-400" />
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {Object.keys(stats.categories).length}
            </div>
            <div className="text-orange-300 text-sm">Categories</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl mb-6">
          <div className="flex border-b border-gray-700">
            {(["overview", "users", "events"] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold transition capitalize ${
                  activeTab === tab
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab === "users"
                  ? `Users (${stats.totalUsers})`
                  : tab === "events"
                    ? `Events (${stats.totalEvents})`
                    : "Overview"}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Category Distribution
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Fix: count is number (not unknown) because categories is Record<string, number> */}
                    {Object.entries(stats.categories).map(
                      ([category, count]) => (
                        <div
                          key={category}
                          className="bg-gray-900 border border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">{category}</span>
                            <span className="text-2xl font-bold text-white">
                              {count}
                            </span>
                          </div>
                          <div className="mt-2 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 rounded-full h-2"
                              style={{
                                width: `${
                                  stats.totalEvents > 0
                                    ? (count / stats.totalEvents) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        Admin Controls
                      </h4>
                      <p className="text-gray-300 text-sm">
                        You have full access to manage all users and events. Use
                        the tabs above to view and manage platform content.
                        Exercise caution when deleting items as this action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">All Users</h3>
                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No users registered yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900 border-b border-gray-700">
                        <tr>
                          {[
                            "Name",
                            "Email",
                            "College",
                            "Phone",
                            "Joined",
                            "Actions",
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
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-900/50">
                            <td className="px-4 py-3 text-white">
                              {user.name}
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                              {user.email}
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                              {user.college}
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                              {user.phone}
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: "user",
                                    id: user.id,
                                  })
                                }
                                className="text-red-400 hover:text-red-300 transition"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  All Events
                </h3>
                {events.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No events created yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900 border-b border-gray-700">
                        <tr>
                          {[
                            "Event Name",
                            "Category",
                            "Date",
                            "Created By",
                            "Actions",
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
                        {events.map((event) => (
                          <tr key={event.id} className="hover:bg-gray-900/50">
                            <td className="px-4 py-3 text-white">
                              {event.name}
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                                {event.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                              {formatDate(event.date)}
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                              {event.createdByName}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: "event",
                                    id: event.id,
                                  })
                                }
                                className="text-red-400 hover:text-red-300 transition"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.type && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-500/10 p-2 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this {deleteConfirm.type}? This
              action cannot be undone.
              {deleteConfirm.type === "user" &&
                " All events created by this user will also be deleted."}
            </p>
            <div className="flex space-x-4">
              {/* Fix: handleConfirmDelete centralises the null guard — no inline ternary needed */}
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm({ type: null, id: null })}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
