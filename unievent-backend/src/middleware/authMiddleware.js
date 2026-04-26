const jwt = require("jsonwebtoken");
const User = require("../models/User");


const protect = async (req, res, next) => {

  try {

    let token;


    if (

      req.headers.authorization &&

      req.headers.authorization.startsWith("Bearer")
    )
     {

      token = req.headers.authorization.split(" ")[1];
    }


    if (!token) 
      {
      console.log("⚠️  No token provided");

      return res.status(401).json({ msg: "No token, authorization denied" });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(`🔐 Token verified for user id: ${decoded.id}`);


    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "User not found, token invalid" });

    }

    req.user = user;


    next();

  } catch
   (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }


};


const isAdmin = (req, res, next) => {


  if (req.user && req.user.role === "admin") {


    console.log(`✅ Admin access granted to: ${req.user.email}`);
    return next();

  }
  console.log(`🚫 Admin access denied for role: ${req.user?.role}`);
  return res.status(403).json({ msg: "Access denied. Admins only." });
};


const isUser = (req, res, next) => {


  if (req.user && req.user.role === "user") {


    console.log(`✅ User access granted to: ${req.user.email}`);


    return next();
  }
  console.log(`🚫 User access denied for role: ${req.user?.role}`);

  return res.status(403).json({ msg: "Access denied. Users only." });
  
};

module.exports = { protect, isAdmin, isUser };