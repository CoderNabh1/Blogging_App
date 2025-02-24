const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secret = process.env.JWT_SECRET || "$uperCoder@1234"; // Use env variable

function createTokenForUser(user) {
    const payload = {
        _id: user.id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };

    // Added token expiry (1 hour)
    return JWT.sign(payload, secret, { expiresIn: "1h" });
}

function validateToken(token) {
    try {
        return JWT.verify(token, secret);
    } catch (error) {
        console.error("Invalid Token:", error.message);
        return null; // Return null instead of crashing
    }
}

module.exports = {
    createTokenForUser,
    validateToken,
};