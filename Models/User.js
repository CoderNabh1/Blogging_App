const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profileImageURL: {
      type: String,
      default: "/images/default-user.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

// Password validation middleware (before saving)
userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        console.log("Password being validated:", this.password); // Log the password
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (!passwordRegex.test(this.password)) {
            return next(
                new Error(
                    "Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
                )
            );
        }
    }
    next();
});

const User = model("User", userSchema);

module.exports = User;