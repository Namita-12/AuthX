const AuthEvent = require("../models/AuthEvent");
const SecurityIncident = require("../models/SecurityIncident");
const ResponseAction = require("../models/ResponseAction");
const UserTrust = require("../models/UserTrust");

const getUserDashboard = async (userId) => {
    const [
        trust,
        recentEvents,
        openIncidents,
        recentResponseActions,
        successfulLogins,
        failedLogins,
        challenges,
        blockedLogins,
        lowRiskEvents,
        mediumRiskEvents,
        highRiskEvents,
        criticalRiskEvents,
        executedResponses
    ] = await Promise.all([
        UserTrust.findOne({ userId }),

        AuthEvent.find({ userId })
            .sort({ timestamp: -1 })
            .limit(10),

        SecurityIncident.find({
            userId,
            status: {
                $in: ["OPEN", "INVESTIGATING"]
            }
        }).sort({ detectedAt: -1 }),

        ResponseAction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10),

        AuthEvent.countDocuments({
            userId,
            eventType: "LOGIN_SUCCESS"
        }),

        AuthEvent.countDocuments({
            userId,
            eventType: "LOGIN_FAILED"
        }),

        AuthEvent.countDocuments({
            userId,
            eventType: "LOGIN_CHALLENGE_REQUIRED"
        }),

        AuthEvent.countDocuments({
            userId,
            eventType: "LOGIN_BLOCKED"
        }),

        AuthEvent.countDocuments({
            userId,
            riskLevel: "LOW"
        }),

        AuthEvent.countDocuments({
            userId,
            riskLevel: "MEDIUM"
        }),

        AuthEvent.countDocuments({
            userId,
            riskLevel: "HIGH"
        }),

        AuthEvent.countDocuments({
            userId,
            riskLevel: "CRITICAL"
        }),

        ResponseAction.countDocuments({
            userId,
            status: "EXECUTED"
        })
    ]);

    return {
        trust: trust || {
            userId,
            trustScore: 70,
            trustLevel: "NORMAL"
        },

        statistics: {
            authentication: {
                successfulLogins,
                failedLogins,
                challenges,
                blockedLogins
            },

            risk: {
                low: lowRiskEvents,
                medium: mediumRiskEvents,
                high: highRiskEvents,
                critical: criticalRiskEvents
            },

            security: {
                openIncidents: openIncidents.length,
                recentEvents: recentEvents.length,
                recentResponseActions:
                    recentResponseActions.length,
                executedResponses
            }
        },

        recentEvents,
        openIncidents,
        recentResponseActions
    };
};

module.exports = {
    getUserDashboard
};