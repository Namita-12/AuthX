const express = require("express");

const authenticateToken =
    require("../middleware/authMiddleware");

const {
    getNetworkIntelligence
} = require("../services/networkIntelligenceService");

const router = express.Router();

router.get(
    "/:ipAddress",
    authenticateToken,
    async (req, res) => {
        try {
            const result =
                getNetworkIntelligence(
                    req.params.ipAddress
                );

            return res.status(200).json({
                success: true,
                network: result
            });

        } catch (error) {
            console.error(
                "Network intelligence check failed:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to analyze network intelligence"
            });
        }
    }
);

module.exports = router;