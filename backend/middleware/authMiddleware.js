
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        // Check JWT secret configuration
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing");

            return res.status(500).json({
                message: "Server authentication configuration error"
            });
        }

        // Get Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization token is required"
            });
        }

        // Check Bearer token format
        const [scheme, token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Invalid authorization format. Use Bearer token"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Validate token payload
        if (!decoded.userId) {
            return res.status(401).json({
                message: "Invalid token payload"
            });
        }

        // Store verified token data for the controller
        req.user = decoded;

        return next();

    } catch (error) {
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        console.error(
            "Authentication middleware error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = protect;
