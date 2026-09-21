const jwt = require("jsonwebtoken");
const Session = require("../models/Session");

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Access token required"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization format"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded.sessionId) {
            return res.status(401).json({
                success: false,
                message: "Session information missing from token"
            });
        }

        const session = await Session.findOne({
            sessionId: decoded.sessionId
        });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Session not found"
            });
        }

        if (session.revoked) {
            return res.status(401).json({
                success: false,
                message: "Session has been revoked"
            });
        }

        if (session.expiresAt <= new Date()) {
            return res.status(401).json({
                success: false,
                message: "Session has expired"
            });
        }

        req.user = decoded;
        req.session = session;

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token expired"
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid access token"
        });
    }
};

module.exports = authenticateToken;