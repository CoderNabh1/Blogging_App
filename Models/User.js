const bcrypt = require("bcrypt");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../Services/Auth.js");

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    profileImageURL: { type: String, default: "/images/default-user.png" },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true }
);

// Password Hashing Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(this.password)) {
    return next(new Error("Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."));
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.isPasswordValid = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Login function with token generation
userSchema.statics.matchPasswordandGenerateToken = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found!");

  const isMatch = await user.isPasswordValid(password);
  if (!isMatch) throw new Error("Incorrect password!");

  const token = createTokenForUser(user);
  console.log("Generated Token:", token); // Debugging line ✅

  return token;
};

const User = model("User", userSchema);
module.exports = User;