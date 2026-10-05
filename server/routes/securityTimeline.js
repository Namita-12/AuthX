const express = require("express");

const authenticateToken =
    require("../middleware/authMiddleware");

const {
    getSecurityTimeline
} = require("../services/securityTimelineService");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    async (req, res) => {
        try {
            const page = Math.max(
                parseInt(req.query.page) || 1,
                1
            );

            const limit = Math.min(
                Math.max(
                    parseInt(req.query.limit) || 20,
                    1
                ),
                50
            );

            const result =
                await getSecurityTimeline(
                    req.user.userId,
                    page,
                    limit
                );

            return res.status(200).json({
                success: true,
                pagination: {
                    page,
                    limit,
                    total: result.total,
                    pages: Math.ceil(
                        result.total / limit
                    )
                },
                timeline: result.timeline
            });

        } catch (error) {
            console.error(
                "Failed to fetch security timeline:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch security timeline"
            });
        }
    }
);

module.exports = router;