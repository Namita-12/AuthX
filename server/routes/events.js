const express = require("express");
const AuthEvent = require("../models/AuthEvent");

const validateAuthEvent = require("../middleware/validateAuthEvent");
const authenticateToken = require("../middleware/authMiddleware");

const { getUserBaseline } = require("../services/userBaselineService");
const { analyzeBehavior } = require("../services/behaviorAnalyzer");

const {
    calculateRiskCorrelation
} = require("../risk-engine/riskCorrelationEngine");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    validateAuthEvent,
    async (req, res) => {
        try {
            console.log("\n===== INCOMING AUTH EVENT =====");
            console.log(
                JSON.stringify(req.body, null, 2)
            );
            console.log(
                "================================\n"
            );

            const {
                userId,
                eventType,
                ipAddress,
                location,
                device,
                browser,
                timezone
            } = req.body;

            console.log(
                "LOCATION RECEIVED:",
                location
            );

            console.log(
                "DEVICE RECEIVED:",
                device
            );

            console.log(
                "BROWSER RECEIVED:",
                browser
            );

            // --------------------------------
            // 1. GET USER BASELINE
            // --------------------------------

            const baseline =
                await getUserBaseline(userId);

            console.log(
                "BASELINE:",
                baseline
            );

            // --------------------------------
            // 2. BEHAVIOR ANALYSIS
            // --------------------------------

            const behavior =
                analyzeBehavior(
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

            console.log(
                "BEHAVIOR RESULT:",
                behavior
            );

            // --------------------------------
            // 3. AUTHENTICATION SIGNALS
            // --------------------------------

            const previousEvents =
                await AuthEvent.find({
                    userId
                })
                    .sort({
                        timestamp: -1
                    })
                    .limit(50);

            const fifteenMinutesAgo =
                new Date(
                    Date.now() -
                    15 * 60 * 1000
                );

            const previousFailedAttempts =
                previousEvents.filter(
                    (event) =>
                        event.eventType ===
                            "LOGIN_FAILED" &&
                        event.timestamp >=
                            fifteenMinutesAgo
                ).length;

            const recentFailedAttempts =
                previousFailedAttempts +
                (
                    eventType ===
                    "LOGIN_FAILED"
                        ? 1
                        : 0
                );

            // --------------------------------
            // 4. CREDENTIAL RISK
            // --------------------------------

            // Temporary credential-risk signal.
            // We deliberately do NOT accept or store
            // plaintext passwords in this event API.

            const credentialRisk = {
                score: 0,
                level: "LOW",
                reason:
                    "No credential exposure detected"
            };

            // --------------------------------
            // 5. COMBINED SECURITY SIGNALS
            // --------------------------------

            const securitySignals = {
                eventType,

                recentFailedAttempts,

                behaviorScore:
                    behavior.score,

                behaviorStatus:
                    behavior.status,

                behaviorConfidence:
                    behavior.confidence,

                behaviorSignals:
                    behavior.signals,

                credentialRiskScore:
                    credentialRisk.score,

                credentialRiskLevel:
                    credentialRisk.level,

                credentialRiskReason:
                    credentialRisk.reason
            };

            console.log(
                "SECURITY SIGNALS:",
                securitySignals
            );

            // --------------------------------
            // 6. RISK CORRELATION
            // --------------------------------

            const risk =
                calculateRiskCorrelation(
                    securitySignals
                );

            console.log(
                "CORRELATED RISK:",
                risk
            );

            // --------------------------------
            // 7. SAVE EVENT
            // --------------------------------

            const event =
                await AuthEvent.create({
                    userId,
                    eventType,
                    ipAddress,
                    location,
                    device,
                    browser,
                    timezone,

                    riskScore:
                        risk.score,

                    riskLevel:
                        risk.level,

                    riskReasons:
                        risk.evidence
                });

            // --------------------------------
            // 8. RESPONSE
            // --------------------------------

            res.status(201).json({
                success: true,

                message:
                    "Authentication event recorded and analyzed",

                behavior: {
                    score:
                        behavior.score,

                    status:
                        behavior.status,

                    confidence:
                        behavior.confidence,

                    signals:
                        behavior.signals
                },

                securitySignals: {
                    recentFailedAttempts,

                    credentialRisk: {
                        score:
                            credentialRisk.score,

                        level:
                            credentialRisk.level,

                        reason:
                            credentialRisk.reason
                    }
                },

                risk: {
                    score:
                        risk.score,

                    level:
                        risk.level,

                    confidence:
                        risk.confidence,

                    evidence:
                        risk.evidence,

                    recommendedActions:
                        risk.recommendedActions
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

                error:
                    error.message
            });
        }
    }
);

module.exports = router;