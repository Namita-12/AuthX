const express = require("express");

const authenticateToken =
    require("../middleware/authMiddleware");

const {
    getUserEvidence
} = require("../services/evidenceService");

const router = express.Router();

router.get(
    "/:eventId",
    authenticateToken,
    async (req, res) => {
        try {
            const evidence =
                await getUserEvidence(
                    req.user.userId,
                    req.params.eventId
                );

            if (!evidence) {
                return res.status(404).json({
                    success: false,
                    message: "Evidence not found"
                });
            }

            return res.status(200).json({
                success: true,
                evidence
            });

        } catch (error) {
            console.error(
                "Failed to fetch evidence:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch security evidence"
            });
        }
    }
);

module.exports = router;