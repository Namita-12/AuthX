const express = require("express");
const jwt = require("jsonwebtoken");

const AuthEvent = require("../models/AuthEvent");

const {
    authenticateUser
} = require("../services/authenticationService");

const {
    getUserBaseline
} = require("../services/userBaselineService");

const {
    analyzeBehavior
} = require("../services/behaviorAnalyzer");

const {
    evaluateAuthenticationRisk
} = require("../services/authenticationRiskService");

const router = express.Router();

router.post("/login", async (req, res) => {

    try {

        const {
            userId,
            credential,
            ipAddress,
            location,
            device,
            browser,
            timezone
        } = req.body;

        // --------------------------------------------------
        // 1. Validate required login information
        // --------------------------------------------------

        if (
            !userId ||
            !credential ||
            !ipAddress ||
            !device
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "userId, credential, ipAddress and device are required"
            });
        }

        // --------------------------------------------------
        // 2. Verify credentials
        // --------------------------------------------------

        const authentication =
            authenticateUser(
                userId,
                credential
            );

        // --------------------------------------------------
        // 3. Invalid credentials
        // --------------------------------------------------

        if (!authentication.authenticated) {

            const fifteenMinutesAgo =
                new Date(
                    Date.now() -
                    15 * 60 * 1000
                );

            const previousFailedAttempts =
                await AuthEvent.countDocuments({
                    userId,

                    eventType:
                        "LOGIN_FAILED",

                    timestamp: {
                        $gte: fifteenMinutesAgo
                    }
                });

            const recentFailedAttempts =
                previousFailedAttempts + 1;

            await AuthEvent.create({

                userId,

                eventType:
                    "LOGIN_FAILED",

                ipAddress,

                location,

                device,

                browser,

                timezone,

                riskScore: 0,

                riskLevel: "LOW",

                riskReasons: [
                    "Invalid credentials"
                ]

            });

            return res.status(401).json({

                success: false,

                message:
                    "Invalid credentials",

                recentFailedAttempts

            });
        }

        // --------------------------------------------------
        // 4. Build user's behavioral baseline
        // --------------------------------------------------

        const baseline =
            await getUserBaseline(
                userId
            );

        // --------------------------------------------------
        // 5. Create current authentication event
        // --------------------------------------------------

        const currentEvent = {

            userId,

            eventType:
                "LOGIN_SUCCESS",

            ipAddress,

            location,

            device,

            browser,

            timezone,

            timestamp:
                new Date()

        };

        // --------------------------------------------------
        // 6. Analyze authentication behavior
        // --------------------------------------------------

        const behavior =
            analyzeBehavior(
                currentEvent,
                baseline
            );

        // --------------------------------------------------
        // 7. Count recent failed attempts
        // --------------------------------------------------

        const fifteenMinutesAgo =
            new Date(
                Date.now() -
                15 * 60 * 1000
            );

        const recentFailedAttempts =
            await AuthEvent.countDocuments({

                userId,

                eventType:
                    "LOGIN_FAILED",

                timestamp: {
                    $gte: fifteenMinutesAgo
                }

            });

        // --------------------------------------------------
        // 8. Get credential risk
        // --------------------------------------------------

        const credentialRisk =
            authentication.credentialRisk;

        // --------------------------------------------------
        // 9. Evaluate complete authentication security
        // --------------------------------------------------

        const securityEvaluation =
            evaluateAuthenticationRisk({

                eventType:
                    "LOGIN_SUCCESS",

                behavior,

                recentFailedAttempts,

                credentialRisk

            });

        // --------------------------------------------------
        // 10. BLOCK decision
        // --------------------------------------------------

        if (
            securityEvaluation
                .decision
                .action === "BLOCK"
        ) {

            const blockedEvent =
                await AuthEvent.create({

                    userId,

                    eventType:
                        "LOGIN_BLOCKED",

                    ipAddress,

                    location,

                    device,

                    browser,

                    timezone,

                    timestamp:
                        new Date(),

                    riskScore:
                        securityEvaluation
                            .risk
                            .score,

                    riskLevel:
                        securityEvaluation
                            .risk
                            .level,

                    riskReasons:
                        securityEvaluation
                            .risk
                            .evidence

                });

            return res.status(403).json({

                success: false,

                message:
                    "Authentication blocked due to security risk",

                accountTakeover:
                    securityEvaluation
                        .accountTakeover,

                behavior,

                credentialRisk,

                risk:
                    securityEvaluation
                        .risk,

                decision:
                    securityEvaluation
                        .decision,

                eventId:
                    blockedEvent._id

            });
        }

        // --------------------------------------------------
        // 11. Additional authentication required
        // --------------------------------------------------

        if (
            securityEvaluation
                .decision
                .requiresAdditionalAuthentication
        ) {

            const challengeEvent =
                await AuthEvent.create({

                    userId,

                    eventType:
                        "LOGIN_CHALLENGE_REQUIRED",

                    ipAddress,

                    location,

                    device,

                    browser,

                    timezone,

                    timestamp:
                        new Date(),

                    riskScore:
                        securityEvaluation
                            .risk
                            .score,

                    riskLevel:
                        securityEvaluation
                            .risk
                            .level,

                    riskReasons:
                        securityEvaluation
                            .risk
                            .evidence

                });

            return res.status(202).json({

                success: false,

                message:
                    "Additional authentication required",

                accountTakeover:
                    securityEvaluation
                        .accountTakeover,

                behavior,

                credentialRisk,

                risk:
                    securityEvaluation
                        .risk,

                decision:
                    securityEvaluation
                        .decision,

                eventId:
                    challengeEvent._id

            });
        }

        // --------------------------------------------------
        // 12. ALLOW → record actual successful login
        // --------------------------------------------------

        const successfulEvent =
            await AuthEvent.create({

                userId,

                eventType:
                    "LOGIN_SUCCESS",

                ipAddress,

                location,

                device,

                browser,

                timezone,

                timestamp:
                    new Date(),

                riskScore:
                    securityEvaluation
                        .risk
                        .score,

                riskLevel:
                    securityEvaluation
                        .risk
                        .level,

                riskReasons:
                    securityEvaluation
                        .risk
                        .evidence

            });

        // --------------------------------------------------
        // 13. Generate JWT
        // --------------------------------------------------

        const token =
            jwt.sign(

                {
                    userId
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1h"
                }

            );

        // --------------------------------------------------
        // 14. Return successful authentication
        // --------------------------------------------------

        return res.json({

            success: true,

            message:
                "Authentication successful",

            accessToken:
                token,

            accountTakeover:
                securityEvaluation
                    .accountTakeover,

            behavior,

            credentialRisk,

            risk:
                securityEvaluation
                    .risk,

            decision:
                securityEvaluation
                    .decision,

            eventId:
                successfulEvent._id

        });

    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Authentication processing failed"

        });

    }

});

module.exports = router;