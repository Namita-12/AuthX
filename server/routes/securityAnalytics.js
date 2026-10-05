const express = require("express");

const authenticateToken =
    require("../middleware/authMiddleware");

const {
    getSecurityAnalytics
} = require("../services/securityAnalyticsService");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    async (req, res) => {
        try {
            const result =
                await getSecurityAnalytics(
                    req.user.userId
                );

            return res.status(200).json({
                success: true,
                analytics: result
            });

        } catch (error) {
            console.error(
                "Failed to fetch security analytics:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch security analytics"
            });
        }
    }
);

module.exports = router;