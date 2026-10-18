
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        // Email verification status
        isEmailVerified: {
            type: Boolean,
            default: false
        },

        // Hashed email verification token
        emailVerificationToken: {
            type: String,
            default: null
        },

        // Verification token expiry time
        emailVerificationExpires: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
