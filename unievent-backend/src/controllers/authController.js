// authController.js
const {
  signupService,
  loginService,
  getMeService,
  forgotPasswordService, // ✅ import the service
} = require("../services/authService");

// ✅ Remove bcrypt and User imports — controller doesn't need them anymore
// const bcrypt = require("bcryptjs");   ← DELETE
// const User   = require("../models/User"); ← DELETE

const signup = async (req, res) => {
  console.log("📥 [signup] Request body:", req.body);
  try {
    const result = await signupService(req.body);
    return res.status(201).json(result);
  } catch (err) {
    console.error("❌ [signup] Error:", err.msg || err.message);
    return res
      .status(err.status || 500)
      .json({ msg: err.msg || "Server error during signup" });
  }
};

const login = async (req, res) => {
  console.log("📥 [login] Request for:", req.body.email);
  try {
    const result = await loginService(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ [login] Error:", err.msg || err.message);
    return res
      .status(err.status || 500)
      .json({ msg: err.msg || "Server error during login" });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await getMeService(req.user._id);
    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ [getMe] Error:", err.msg || err.message);
    return res
      .status(err.status || 500)
      .json({ msg: err.msg || "Server error fetching profile" });
  }
};

// ✅ Clean — just calls the service, no direct DB logic here
const forgotPassword = async (req, res) => {
  try {
    console.log("Body received:", req.body);
    const result = await forgotPasswordService(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Forgot password error:", err.msg || err.message);
    return res
      .status(err.status || 500)
      .json({ message: err.msg || err.message });
  }
};

module.exports = { signup, login, getMe, forgotPassword };
