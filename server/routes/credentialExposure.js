const express = require("express");

const authenticateToken =
    require("../middleware/authMiddleware");

const {
    checkCredentialExposure
} = require("../services/credentialExposureService");

const router = express.Router();

router.post(
    "/check",
    authenticateToken,
    async (req, res) => {
        try {
            const { credential } = req.body;

            if (!credential) {
                return res.status(400).json({
                    success: false,
                    message: "Credential is required"
                });
            }

            const result =
                checkCredentialExposure(credential);

            return res.status(200).json({
                success: true,
                exposure: result
            });

        } catch (error) {
            console.error(
                "Credential exposure check failed:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to check credential exposure"
            });
        }
    }
);

module.exports = router;