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

            const actions =
                await getUserResponseActions(
                    req.user.userId
                );

            return res.status(200).json({
                success: true,
                count: actions.length,
                actions
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