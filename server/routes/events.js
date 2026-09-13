const express = require("express");
const AuthEvent = require("../models/AuthEvent");

const { calculateRisk } = require("../risk-engine/riskEngine");

const validateAuthEvent = require("../middleware/validateAuthEvent");
const authenticateToken = require("../middleware/authMiddleware");

const { getUserBaseline } = require("../services/userBaselineService");
const { analyzeBehavior } = require("../services/behaviorAnalyzer");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    validateAuthEvent,
    async (req, res) => {
        try {
            console.log("\n===== INCOMING AUTH EVENT =====");
console.log(JSON.stringify(req.body, null, 2));
console.log("================================\n");
console.log("DEBUG BODY:", JSON.stringify(req.body, null, 2));
            const {
                userId,
                eventType,
                ipAddress,
                location,
                device,
                browser,
                timezone
            } = req.body;
            console.log("LOCATION RECEIVED:", location);
console.log("DEVICE RECEIVED:", device);
console.log("BROWSER RECEIVED:", browser);

            // --------------------------------
            // 1. GET USER BASELINE
            // --------------------------------

            const baseline = await getUserBaseline(userId);

            // --------------------------------
            // 2. BEHAVIOR ANALYSIS
            // --------------------------------

            const behavior = analyzeBehavior(
                {
                    eventType,
                    device,
                    location,
                    browser,
                    timestamp: new Date(),
                    timezone
                },
                baseline
            );
            console.log("BASELINE:", baseline);
console.log("BEHAVIOR RESULT:", behavior);

            // --------------------------------
            // 3. AUTHENTICATION SIGNALS
            // --------------------------------

            const previousEvents = await AuthEvent.find({
                userId
            })
                .sort({ timestamp: -1 })
                .limit(50);

            const fifteenMinutesAgo = new Date(
                Date.now() - 15 * 60 * 1000
            );

            const previousFailedAttempts =
                previousEvents.filter(
                    (event) =>
                        event.eventType === "LOGIN_FAILED" &&
                        event.timestamp >= fifteenMinutesAgo
                ).length;

            const recentFailedAttempts =
                previousFailedAttempts +
                (eventType === "LOGIN_FAILED" ? 1 : 0);

            // --------------------------------
            // 4. SECURITY SIGNALS
            // --------------------------------

            const securitySignals = {
                eventType,

                recentFailedAttempts,

                behaviorScore: behavior.score,
                behaviorStatus: behavior.status,
                behaviorConfidence: behavior.confidence,
                behaviorSignals: behavior.signals
            };

            // --------------------------------
            // 5. RISK ANALYSIS
            // --------------------------------

            const risk = calculateRisk(securitySignals);

            // --------------------------------
            // 6. SAVE EVENT
            // --------------------------------

            const event = await AuthEvent.create({
                userId,
                eventType,
                ipAddress,
                location,
                device,
                browser,
                timezone,

                riskScore: risk.score,
                riskLevel: risk.level,
                riskReasons: risk.reasons
            });

            // --------------------------------
            // 7. RESPONSE
            // --------------------------------

            res.status(201).json({
                success: true,

                message:
                    "Authentication event recorded and analyzed",

                behavior: {
                    score: behavior.score,
                    status: behavior.status,
                    confidence: behavior.confidence,
                    signals: behavior.signals
                },

                securitySignals: {
                    recentFailedAttempts
                },

                risk: {
                    score: risk.score,
                    level: risk.level,
                    reasons: risk.reasons
                },

                event
            });

        } catch (error) {

            console.error(
                "Auth event error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to process authentication event",
                error: error.message
            });
        }
    }
);

module.exports = router;