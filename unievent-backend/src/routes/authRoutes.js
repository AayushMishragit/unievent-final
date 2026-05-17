const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  getMe,
  forgotPassword,
} = require("../controllers/authController");

const { protect, isAdmin, isUser } = require("../middleware/authMiddleware");

router.post("/signup", signup);

router.post("/login", login);

router.get("/me", protect, getMe);

router.get("/admin-only", protect, isAdmin, (req, res) => {
  res.json({ msg: `Welcome, Admin ${req.user.name}! 🎉` });
});

router.get("/user-only", protect, isUser, (req, res) => {
  res.json({ msg: `Welcome, User ${req.user.name}! 👋` });
});

router.post("/forget-password", forgotPassword);

module.exports = router;
