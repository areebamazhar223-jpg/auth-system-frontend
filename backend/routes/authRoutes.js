
const express = require("express");

const {
    signup,
    login,
    verifyEmail,
    resendVerificationEmail,
    logout,
    getProfile
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

// Protected routes
router.get("/profile", protect, getProfile);

// Logout route
router.post("/logout", logout);

module.exports = router;
