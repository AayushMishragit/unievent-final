const { signupService, loginService, getMeService } = require("../services/authService");


const signup = async (req, res) =>
   {
  console.log("📥 [signup] Request body:",    req.body);


  try {


    const result =   await signupService(req.body);

    return res.status(201).json(result);

  } catch (err) 
  {
    console.error("❌ [signup] Error:",
       err.msg || err.message);
    return res.status(err.status || 500).json({ msg: err.msg || "Server error during signup" });

  }
};


const login = async (req, res) => {

  console.log("📥 [login] Request for:", req.body.email);


  try
  
  {
    const result = await loginService(req.body);

    return res.status(200).json(result);
  } 
  catch (err) {

    console.error("❌ [login] Error:", err.msg || err.message);

    return res.status(err.status || 500).json({ msg: err.msg || "Server error during login" });
  }

};


const getMe = async (req, res)=> {
   console.log(`📋 [getMe] Accessed by: ${req.user.email}`);
  try
   {
    const result = await getMeService(req.user._id);
    return res.status(200).json(result);
  } catch (err) {

    console.error("❌ [getMe] Error:", err.msg || err.message);
    return res.status(err.status || 500).json({ msg: err.msg || "Server error fetching profile" });
  }

};

module.exports = { signup, login, getMe };