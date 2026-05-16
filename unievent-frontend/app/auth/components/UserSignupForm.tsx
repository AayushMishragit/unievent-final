"use client";
import { useState } from "react";
import { signupUser } from "../../Service/authService";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  setMode: (mode: "signup" | "login") => void; // ✅ fixed type
};

export default function UserSignupForm({ setMode }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.confirm) {
      return setError("All fields are required");
    }
    if (form.password !== form.confirm) {
      return setError("Passwords do not match");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await signupUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: "user",
      });

      toast.success("Account created! Redirecting ...");
      setTimeout(() => (window.location.href = "/"), 1500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Signup failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
          {success}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="text-sm text-gray-400">Full Name</label>
        <div className="flex items-center gap-2 mt-1 bg-white/5 border border-white/10 rounded-lg px-3">
          <User size={16} className="text-gray-400" />
          <input
            className="bg-transparent p-3 outline-none w-full text-white placeholder-gray-500"
            placeholder="Alex Johnson"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="text-sm text-gray-400">University Email</label>
        <div className="flex items-center gap-2 mt-1 bg-white/5 border border-white/10 rounded-lg px-3">
          <Mail size={16} className="text-gray-400" />
          <input
            type="email"
            className="bg-transparent p-3 outline-none w-full text-white placeholder-gray-500"
            placeholder="alex@university.edu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      {/* Password + Confirm */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-sm text-gray-400">Password</label>
          <div className="flex items-center gap-2 mt-1 bg-white/5 border border-white/10 rounded-lg px-3">
            <Lock size={16} className="text-gray-400" />
            <input
              type="password"
              className="bg-transparent p-3 outline-none w-full text-white"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-sm text-gray-400">Confirm</label>
          <div className="flex items-center gap-2 mt-1 bg-white/5 border border-white/10 rounded-lg px-3">
            <Lock size={16} className="text-gray-400" />
            <input
              type="password"
              className="bg-transparent p-3 outline-none w-full text-white"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 font-medium disabled:opacity-50 transition-opacity"
      >
        {loading ? "Creating Account..." : "Create Account →"}
      </button>

      <div className="text-center text-xs text-gray-400">OR CONTINUE WITH</div>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
        >
          Google
        </button>
        <button
          type="button"
          className="flex-1 p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
        >
          GitHub
        </button>
      </div>

      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <span
          className="text-purple-400 cursor-pointer hover:underline"
          onClick={() => setMode("login")}
        >
          Log in
        </span>
      </p>
    </form>
  );
}
