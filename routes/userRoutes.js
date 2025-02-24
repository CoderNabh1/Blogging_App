const express = require('express');
const User = require('../Models/User'); // Ensure correct path to User model
const bcrypt = require('bcrypt');

const router = express.Router();

router.get("/signin", (req, res) => {
    return res.render("SignIn");
});

router.get("/signup", (req, res) => {
    return res.render("SignUp");
});

// Register User Route
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Check if email already exists
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        // Password validation
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser  = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || "USER" // Default role
        });

        await newUser .save();

        // Redirect or send JSON response (choose one)
        return res.redirect("/signin"); // Redirect to SignIn page after signup
    } 
    catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;