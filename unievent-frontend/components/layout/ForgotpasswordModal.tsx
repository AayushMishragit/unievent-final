"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { forgetPasswordservice } from "@/app/Service/authService"; // ✅ correct import
import { Eye, EyeClosed } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  email: string;
  name: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ForgotPasswordModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<FormState>({
    email: "",
    name: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Bug 4 fixed — no event parameter
  const handleSubmit = async () => {
    if (
      !form.email ||
      !form.name ||
      !form.newPassword ||
      !form.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Enter a valid email");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      // ✅ Bug 1 fixed — correct service name
      await forgetPasswordservice({
        email: form.email,
        name: form.name,
        newpassword: form.newPassword,
        confirmpassword: form.confirmPassword,
      });
      toast.success("Password reset successful! Please login.");
      setForm({ email: "", name: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
      console.log("Forgot password error:", err);
      console.log(err.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Verify your identity and set a new password.
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your registered name"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Min 6 characters"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-9 text-gray-400"
            >
              {showPass ? <EyeClosed /> : <Eye />}
            </button>
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-9 text-gray-400"
            >
              {showConfirm ? <EyeClosed /> : <Eye />}
            </button>
          </div>

          {/* ✅ Bug 3 fixed — type="button" + onClick */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
// ✅ Bug 2 fixed — stub function removed entirely
