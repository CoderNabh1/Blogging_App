const express = require("express");
const User = require("../Models/User");
const router = express.Router();

router.get("/signin", (req, res) => res.render("SignIn"));
router.get("/signup", (req, res) => res.render("SignUp"));

// User Sign-In Route
router.post("/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Incoming Sign-In Request:", req.body);
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required!" });
      }
  
      // This method already verifies the password
      const token = await User.matchPasswordandGenerateToken(email, password);
  
      console.log("User Signed In Successfully:", email);
      
      // Set token in cookies (optional)
      res.cookie("authToken", token, { httpOnly: true });
  
      return res.cookie('token',token).redirect("/");
    } catch (error) {
      return res.status(500).render("SignIn",{error:"Incorrect Email or Password"});
    }
  });
  

// User Registration Route
router.post("/signup", async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body);

    let { firstName, lastName, email, password, role } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required!" });

    email = email.trim().toLowerCase();
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email already in use!" });

    const newUser = new User({ firstName, lastName, email, password, role: role || "USER" });
    await newUser.save();

    console.log("✅ User Created Successfully:", newUser);
    return res.redirect("/user/signin");
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;