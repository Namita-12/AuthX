const AuthEvent = require("../models/AuthEvent");
const SecurityIncident = require("../models/SecurityIncident");
const ResponseAction = require("../models/ResponseAction");

const getSecurityAnalytics = async (userId) => {
    const events = await AuthEvent.find({
        userId
    })
        .sort({ timestamp: -1 })
        .limit(100)
        .lean();

    const [
        incidents,
        executedResponses
    ] = await Promise.all([
        SecurityIncident.countDocuments({
            userId
        }),

        ResponseAction.countDocuments({
            userId,
            status: "EXECUTED"
        })
    ]);

    const analytics = {
        totalEvents: events.length,

        authentication: {
            successful: events.filter(
                e => e.eventType === "LOGIN_SUCCESS"
            ).length,

            failed: events.filter(
                e => e.eventType === "LOGIN_FAILED"
            ).length,

            challenged: events.filter(
                e =>
                    e.eventType ===
                    "LOGIN_CHALLENGE_REQUIRED"
            ).length,

            blocked: events.filter(
                e =>
                    e.eventType === "LOGIN_BLOCKED"
            ).length
        },

        riskDistribution: {
            low: events.filter(
                e => e.riskLevel === "LOW"
            ).length,

            medium: events.filter(
                e => e.riskLevel === "MEDIUM"
            ).length,

            high: events.filter(
                e => e.riskLevel === "HIGH"
            ).length,

            critical: events.filter(
                e => e.riskLevel === "CRITICAL"
            ).length
        },

        securityActivity: {
            incidents,
            executedResponses
        }
    };

    const riskEvents = events.filter(
        e =>
            e.riskLevel === "HIGH" ||
            e.riskLevel === "CRITICAL"
    );

    const reasonFrequency = {};

    for (const event of riskEvents) {
        for (const reason of event.riskReasons || []) {
            reasonFrequency[reason] =
                (reasonFrequency[reason] || 0) + 1;
        }
    }

    const topRiskSignals = Object.entries(
        reasonFrequency
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([reason, count]) => ({
            reason,
            count
        }));

    return {
        analytics,
        topRiskSignals
    };
};

module.exports = {
    getSecurityAnalytics
};