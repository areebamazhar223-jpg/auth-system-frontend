
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// ==================== SIGNUP ====================

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto
            .randomBytes(32)
            .toString("hex");

        const hashedVerificationToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        const verificationExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            isEmailVerified: false,
            emailVerificationToken: hashedVerificationToken,
            emailVerificationExpires: verificationExpires
        });

        const verificationLink =
            `${process.env.API_URL || "http://localhost:5000"}/api/auth/verify-email?token=${verificationToken}`;

        try {
            await sendEmail(
                user.email,
                "Verify Your Email - Api Learning",
                `Hello ${user.name},

Thank you for registering with Api Learning!

Please verify your email using this link:

${verificationLink}

This link expires in 15 minutes.

If you did not create this account, please ignore this email.`
            );
        } catch (emailError) {
            await User.findByIdAndDelete(user._id);

            console.error(
                "Verification email error:",
                emailError.message
            );

            return res.status(500).json({
                message: "Could not send verification email. Check your email configuration."
            });
        }

        return res.status(201).json({
            message: "Registration successful. Please check your email.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        console.error("Signup error:", error.message);

        return res.status(500).json({
            message: "Server error during signup"
        });
    }
};


// ==================== LOGIN ====================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Valid email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in."
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing");

            return res.status(500).json({
                message: "Server authentication configuration error"
            });
        }

        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Server error during login"
        });
    }
};


// ==================== VERIFY EMAIL ====================

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token || typeof token !== "string") {
            return res.status(400).json({
                message: "Verification token is required"
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: {
                $gt: new Date()
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification link"
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;

        await user.save();

        return res.status(200).json({
            message: "Email verified successfully. You can now log in."
        });

    } catch (error) {
        console.error("Verify email error:", error.message);

        return res.status(500).json({
            message: "Server error during email verification"
        });
    }
};


// ==================== RESEND VERIFICATION EMAIL ====================

const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({
                message: "Valid email is required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "Account not found. Please sign up first."
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                message: "Email is already verified."
            });
        }

        const verificationToken = crypto
            .randomBytes(32)
            .toString("hex");

        const hashedVerificationToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        user.emailVerificationToken = hashedVerificationToken;
        user.emailVerificationExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await user.save();

        const verificationLink =
            `${process.env.API_URL || "http://localhost:5000"}/api/auth/verify-email?token=${verificationToken}`;

        try {
            await sendEmail(
                user.email,
                "Verify Your Email - Api Learning",
                `Hello ${user.name},

Please verify your email using this link:

${verificationLink}

This link expires in 15 minutes.`
            );
        } catch (emailError) {
            console.error(
                "Resend email error:",
                emailError.message
            );

            return res.status(500).json({
                message: "Could not send verification email. Check your email configuration."
            });
        }

        return res.status(200).json({
            message: "Verification email sent. Check your inbox and spam folder."
        });

    } catch (error) {
        console.error(
            "Resend verification error:",
            error.message
        );

        return res.status(500).json({
            message: "Server error while resending verification email."
        });
    }
};


// ==================== LOGOUT ====================

const logout = async (req, res) => {
    return res.status(200).json({
        message: "Logout successful. Discard your login token on the client."
    });
};


// ==================== GET PROFILE ====================

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select(
                "-password -emailVerificationToken -emailVerificationExpires"
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        console.error("Get profile error:", error.message);

        return res.status(500).json({
            message: "Server error while fetching profile"
        });
    }
};


// ==================== EXPORT ====================

module.exports = {
    signup,
    login,
    verifyEmail,
    resendVerificationEmail,
    logout,
    getProfile
};
