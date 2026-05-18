const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // ✅ exact frontend URL, no trailing slash
    credentials: true, // ✅ required for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ allow OPTIONS
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ allow these headers
  }),
);

app.options("*", cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventroutes"));

app.get("/", (req, res) => {
  res.json({ msg: " API is running 🚀" });
});

app.use((req, res) => {
  res.status(404).json({ msg: `Route ${req.method} ${req.url} not found` });
});

app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err.message);

  res
    .status(err.status || 500)
    .json({ msg: err.message || "Internal server error" });
});

module.exports = app;
