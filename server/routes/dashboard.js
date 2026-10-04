const express = require("express");

const authenticateToken =
    require("../middleware/authMiddleware");

const {
    getUserDashboard
} = require("../services/dashboardService");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    async (req, res) => {
        try {
            const dashboard =
                await getUserDashboard(
                    req.user.userId
                );

            return res.status(200).json({
                success: true,
                dashboard
            });

        } catch (error) {
            console.error(
                "Failed to fetch dashboard:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch security dashboard"
            });
        }
    }
);

module.exports = router;