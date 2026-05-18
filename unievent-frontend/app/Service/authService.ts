import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const raw = localStorage.getItem("user");
  if (raw) {
    const parsed = JSON.parse(raw);
    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

export const EventAPI = axios.create({
  baseURL: "http://localhost:5000/api/events",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

EventAPI.interceptors.request.use((config) => {
  const raw = localStorage.getItem("user");

  if (raw) {
    const parsed = JSON.parse(raw);

    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }

  return config;
});

// User Signup
export const signupUser = (data: {
  name: string;
  email: string;
  password: string;
  role: "user";
}) => API.post("/signup", data);

// Admin Signup
export const signupAdmin = (data: {
  name: string;
  email: string;
  password: string;
  role: "admin";
  orgName: string;
  description?: string;
  website?: string;
  teamSize?: number;
}) => API.post("/signup", data);

// Login (both user and admin)
export const loginUser = (data: { email: string; password: string }) =>
  API.post("/login", data);

// Get current logged-in user
export const getMe = () => API.get("/me");

// Logout (client-side)
export const logout = async () => {
  await API.post("/logout");
  localStorage.removeItem("user");
};

export const forgetPasswordservice = (data: {
  email: string;
  name: string;
  newpassword: string;
  confirmpassword: string;
}) => API.post("/forget-password", data);

export const createEvent = (data: {
  name: string;
  date: string;
  category: string;
  description: string;
  formlink: string;
}) => EventAPI.post("/", data);
export const toggleDisableEvent = (eventId: string) =>
  EventAPI.patch(`/${eventId}/toggle-disable`);
