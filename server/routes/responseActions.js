const express = require("express");

const authenticateToken =
    require("../middleware/authMiddleware");

const {
    getUserResponseActions
} = require("../services/responseAuditQueryService");

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
                    parseInt(req.query.limit) || 10,
                    1
                ),
                50
            );

            const {
                status,
                action
            } = req.query;

            const result =
                await getUserResponseActions(
                    req.user.userId,
                    status,
                    action,
                    page,
                    limit
                );

            const totalPages =
                Math.ceil(result.total / limit);

            return res.status(200).json({
                success: true,
                pagination: {
                    page,
                    limit,
                    total: result.total,
                    pages: totalPages
                },
                actions: result.actions
            });

        } catch (error) {
            console.error(
                "Failed to fetch response actions:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch response actions"
            });
        }
    }
);

module.exports = router;