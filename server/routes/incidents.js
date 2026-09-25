const express = require("express");

const SecurityIncident =
    require("../models/SecurityIncident");

const authenticateToken =
    require("../middleware/authMiddleware");

const router = express.Router();
const {
    updateIncidentStatus
} = require("../services/incidentStatusService");
router.get(
    "/",
    authenticateToken,
    async (req, res) => {
        try {
            const incidents =
                await SecurityIncident.find({
                    userId: req.user.userId
                })
                .sort({
                    detectedAt: -1
                })
                .populate("relatedEventId");

            return res.json({
                success: true,
                count: incidents.length,
                incidents
            });

        } catch (error) {

            console.error(
                "Incident retrieval error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to retrieve security incidents"
            });
        }
    }
);
router.get(
    "/:id",
    authenticateToken,
    async (req, res) => {
        try {
            const incident =
                await SecurityIncident.findOne({
                    _id: req.params.id,
                    userId: req.user.userId
                })
                .populate("relatedEventId");

            if (!incident) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Security incident not found"
                });
            }

            return res.json({
                success: true,
                incident
            });

        } catch (error) {

            console.error(
                "Incident retrieval error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to retrieve security incident"
            });
        }
    }
);
router.patch(
    "/:id/status",
    authenticateToken,
    async (req, res) => {
        try {
            const {
                status
            } = req.body;

            const result =
                await updateIncidentStatus({
                    incidentId:
                        req.params.id,

                    userId:
                        req.user.userId,

                    status
                });

            if (result.error === "INVALID_STATUS") {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid incident status"
                });
            }

            if (result.error === "NOT_FOUND") {
                return res.status(404).json({
                    success: false,
                    message:
                        "Security incident not found"
                });
            }

            return res.json({
                success: true,
                message:
                    "Security incident status updated",
                incident:
                    result.incident
            });

        } catch (error) {

            console.error(
                "Incident status update error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update incident status"
            });
        }
    }
);
module.exports = router;