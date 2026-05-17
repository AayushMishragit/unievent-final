"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Calendar, Tag, FileText, CheckCircle } from "lucide-react";

// Replace with your real auth context import path
// import { useAuth } from '../AuthContext';
function useAuth() {
  return { user: null as { id: string; name: string } | null };
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  date: string;
  category: string;
  description: string;
  formlink: string;
}

// Partial so fields start empty and are only set on validation failure
type FormErrors = Partial<Record<keyof FormData, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: string[] = [
  "Technical",
  "Cultural",
  "Sports",
  "Workshop",
  "Seminar",
  "Competition",
  "Social",
  "Other",
];

const EMPTY_FORM: FormData = {
  name: "",
  date: "",
  category: "",
  description: "",
  formlink: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fix: store timer ref so we can clear it on unmount — prevents state update on unmounted component
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  // Fix: properly typed change handler covering input, select, and textarea
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSuccessMessage("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Event name is required";
    if (!formData.date) newErrors.date = "Event date is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.formlink)
      newErrors.formlink = "Link of the registration link is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Fix: user null-check before accessing user.id / user.name
    if (!user) {
      router.push("/");
      return;
    }

    // Fix: localStorage inside handler (client-only) — safe, no SSR issue here
    const existing = JSON.parse(localStorage.getItem("events") ?? "[]");

    const newEvent = {
      id: Date.now().toString(),
      ...formData,
      createdBy: user.id,
      createdByName: user.name,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("events", JSON.stringify([...existing, newEvent]));

    setFormData(EMPTY_FORM);
    setSuccessMessage("Event created successfully!");

    // Fix: store ref so timer can be cleared on unmount
    redirectTimer.current = setTimeout(() => {
      router.push("/events");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {/* Fix: user?.name — safe optional chaining */}
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-300">
            Create and manage your college events from your dashboard.
          </p>
        </div>
        Create Event Form
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <PlusCircle className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create New Event</h2>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-md flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400 font-semibold">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Event Name *</span>
                </div>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-700"
                }`}
                placeholder="e.g., Annual Tech Fest 2026"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Event Date *</span>
                </div>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.date ? "border-red-500" : "border-gray-700"
                }`}
              />
              {errors.date && (
                <p className="text-red-400 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>Category *</span>
                </div>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.category ? "border-red-500" : "border-gray-700"
                }`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Description *</span>
                </div>
              </label>
              {/* Fix: rows={4} as number, not rows="4" string */}
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-700"
                }`}
                placeholder="Describe your event..."
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            {/* event form */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Event Form</span>
                </div>
              </label>
              <input
                type="text"
                name="form"
                value={formData.formlink}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-700"
                }`}
                placeholder="e.g., Annual Tech Fest 2026"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.formlink}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Create Event</span>
            </button>
          </form>
        </div>
        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push("/events")}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              View All Events
            </button>
            <button
              onClick={() => router.push("/explorepage")}
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Explore Campus Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
