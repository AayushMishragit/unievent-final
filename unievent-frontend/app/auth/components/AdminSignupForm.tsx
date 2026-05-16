"use client";
import { useState } from "react";
import { signupAdmin } from "../../Service/authService";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast, cssTransition } from "react-toastify";
// type Props = {
//   setMode: React.Dispatch<React.SetStateAction<"signup" | "login">>;
// };
type Props = {
  setMode: (mode: "signup" | "login") => void; // ✅ fixed type
};

export default function AdminSignupForm({ setMode }: Props) {
  const [form, setForm] = useState({
    orgName: "",
    description: "",
    website: "",
    teamSize: "",
    adminName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const input =
    "w-full p-3 mb-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none placeholder-gray-500";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.orgName ||
      !form.adminName ||
      !form.email ||
      !form.password ||
      !form.confirm
    ) {
      return setError("All required fields must be filled");
    }
    if (form.password !== form.confirm) {
      return setError("Passwords do not match");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await signupAdmin({
        name: form.adminName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: "admin",
        orgName: form.orgName.trim(),
        description: form.description.trim(),
        website: form.website.trim(),
        teamSize: form.teamSize ? Number(form.teamSize) : undefined,
      });

      //setSuccess("Organizer account created! Redirecting to login...");
      toast.success("Organizer account created! Redirecting to login...");
      setTimeout(() => setMode("login"), 1500);
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
    <form
      onSubmit={handleSubmit}
      className="max-h-[500px] overflow-y-auto pr-1 space-y-1"
    >
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center mb-2">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center mb-2">
          {success}
        </div>
      )}

      <input
        className={input}
        placeholder="Organization / Club Name *"
        value={form.orgName}
        onChange={(e) => setForm({ ...form, orgName: e.target.value })}
      />

      <textarea
        className={input}
        placeholder="Organization Description"
        rows={3}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        className={input}
        placeholder="Organization Website (optional)"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
      />

      <input
        type="number"
        className={input}
        placeholder="Team Size (optional)"
        value={form.teamSize}
        onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
      />

      {/* File Upload (UI only) */}
      <div className="mb-3">
        <label className="text-sm text-gray-400 block mb-1">
          Verification Document
        </label>
        <label className="flex items-center justify-between px-3 py-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition">
          <span className="text-gray-400 text-sm">
            Upload proof of affiliation (PDF/JPG)
          </span>
          <span className="text-purple-400 text-sm">⬆️</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => console.log("File:", e.target.files?.[0])}
          />
        </label>
      </div>

      <input
        className={input}
        placeholder="Admin Full Name *"
        value={form.adminName}
        onChange={(e) => setForm({ ...form, adminName: e.target.value })}
      />

      <input
        type="email"
        className={input}
        placeholder="University Email *"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <div className="flex gap-2">
        <input
          type="password"
          className={input}
          placeholder="Password *"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="password"
          className={input}
          placeholder="Confirm *"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 font-medium disabled:opacity-50 transition-opacity"
      >
        {loading ? "Creating Account..." : "Create Organizer Account →"}
      </button>

      <p className="text-center text-gray-400 my-3 text-sm">OR CONTINUE WITH</p>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
        >
          Google
        </button>
        <button
          type="button"
          className="flex-1 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
        >
          GitHub
        </button>
      </div>

      <p className="text-center text-sm mt-4 text-gray-400">
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
