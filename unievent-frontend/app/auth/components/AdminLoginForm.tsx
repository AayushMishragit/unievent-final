"use client";
import { useState } from "react";
import { loginUser } from "../../Service/authService";
import { useRouter } from "next/navigation";

type Props = {
  setMode: (mode: "signup" | "login") => void; // ✅ fixed type
};

export default function AdminLoginForm({ setMode }: Props) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const input =
    "w-full p-3 mb-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none placeholder-gray-500";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("Email and password are required");
    }

    setLoading(true);
    try {
      const res = await loginUser(form);
      const { token, user } = res.data;

      if (user.role !== "admin") {
        return setError("Access denied. This login is for admins only.");
      }

      localStorage.setItem("user", JSON.stringify({ token, user }));
      console.log("✅ Admin login successful:", user.email);
      router.push("/admindashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Login failed. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 mb-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <input
        type="email"
        className={input}
        placeholder="Admin Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        className={input}
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg font-medium disabled:opacity-50 transition-opacity"
      >
        {loading ? "Logging in..." : "Log In →"}
      </button>

      <p className="text-center text-sm mt-4 text-gray-400">
        Don&apos;t have an account? {/* ✅ fixed apostrophe */}
        <span
          className="text-purple-400 cursor-pointer hover:underline"
          onClick={() => setMode("signup")}
        >
          Sign up
        </span>
      </p>
    </form>
  );
}
