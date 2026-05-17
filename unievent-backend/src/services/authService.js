// unievent-backend/src/services/authService.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

const signupService = async (body) => {
  const {
    name,
    email,
    password,
    role,
    orgName,
    description,
    website,
    teamSize,
  } = body;

  if (!name || !email || !password || !role) {
    throw { status: 400, msg: "name, email, password and role are required" };
  }

  if (!["user", "admin"].includes(role)) {
    throw { status: 400, msg: "role must be 'user' or 'admin'" };
  }

  if (role === "admin" && !orgName) {
    throw { status: 400, msg: "orgName is required for admin accounts" };
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw { status: 400, msg: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = { name, email, password: hashedPassword, role };

  if (role === "admin") {
    userData.orgName = orgName;
    if (description) userData.description = description;
    if (website) userData.website = website;
    if (teamSize) userData.teamSize = teamSize;
  }

  const user = await User.create(userData);
  console.log(`✅ User created: ${user.email} [${user.role}]`);
  return { msg: "User created successfully", user: sanitizeUser(user) };
};

const loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw { status: 400, msg: "email and password are required" };
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw { status: 400, msg: "Invalid credentials" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 400, msg: "Invalid credentials" };
  }

  const token = generateToken({ id: user._id, role: user.role });
  console.log(`✅ Login successful: ${user.email} [${user.role}]`);
  return { token, user: sanitizeUser(user) };
};

const getMeService = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw { status: 404, msg: "User not found" };
  }
  return { user };
};

// ✅ forgotPassword belongs HERE in backend service
const forgotPasswordService = async ({
  email,
  name,
  newpassword,
  confirmpassword,
}) => {
  if (!email || !name || !newpassword || !confirmpassword) {
    throw { status: 400, msg: "All fields are required" };
  }

  if (newpassword !== confirmpassword) {
    throw { status: 400, msg: "Passwords do not match" };
  }

  if (newpassword.length < 6) {
    throw { status: 400, msg: "Password must be at least 6 characters" };
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw { status: 404, msg: "No account found with this email" };
  }

  if (user.name.toLowerCase() !== name.toLowerCase()) {
    throw { status: 400, msg: "Name does not match our records" };
  }

  user.password = await bcrypt.hash(newpassword, 10);
  await user.save();

  return { message: "Password reset successful! Please login." };
};

// ✅ export all services together
module.exports = {
  signupService,
  loginService,
  getMeService,
  forgotPasswordService, // ✅ added
};
