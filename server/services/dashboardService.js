const AuthEvent = require("../models/AuthEvent");
const SecurityIncident = require("../models/SecurityIncident");
const ResponseAction = require("../models/ResponseAction");
const UserTrust = require("../models/UserTrust");

const getUserDashboard = async (userId) => {
    const [
        trust,
        recentEvents,
        openIncidents,
        recentResponseActions
    ] = await Promise.all([
        UserTrust.findOne({ userId }),

        AuthEvent.find({ userId })
            .sort({ timestamp: -1 })
            .limit(10),

        SecurityIncident.find({
            userId,
            status: {
                $in: [
                    "OPEN",
                    "INVESTIGATING"
                ]
            }
        })
            .sort({ detectedAt: -1 }),

        ResponseAction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
    ]);

    const failedLogins = await AuthEvent.countDocuments({
        userId,
        eventType: "LOGIN_FAILED"
    });

    return {
        trust: trust || {
            userId,
            trustScore: 70,
            trustLevel: "NORMAL"
        },

        statistics: {
            failedLogins,
            openIncidents: openIncidents.length,
            recentEvents: recentEvents.length,
            recentResponseActions:
                recentResponseActions.length
        },

        recentEvents,
        openIncidents,
        recentResponseActions
    };
};

module.exports = {
    getUserDashboard
};
