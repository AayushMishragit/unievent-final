


const authorizeRoles = 
(...roles) => {

  return (req, res, next) => {

    if (!req.user) {

      return res.status(401).json({ msg: "Not authenticated" });
    }


    if (!roles.includes(req.user.role))
       {
      console.log(`🚫 Role [${req.user.role}] not in allowed [${roles.join(", ")}]`);


      return res.status(403).json({


        msg: `Access denied. Required role(s): ${roles.join(", ")}`,


      });
    }

    console.log(`✅ Role [${req.user.role}] authorized for: ${req.user.email}`);


    next();


  };
};


const isAdmin = authorizeRoles("admin");


const isUser  = authorizeRoles("user");


const isAny   = authorizeRoles("user", "admin"); 


module.exports = { authorizeRoles, isAdmin, isUser, isAny };