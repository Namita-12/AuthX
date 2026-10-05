const AuthEvent = require("../models/AuthEvent");
const SecurityIncident = require("../models/SecurityIncident");

const getUserEvidence = async (userId, eventId) => {
    const event = await AuthEvent.findOne({
        _id: eventId,
        userId
    });

    if (!event) {
        return null;
    }

    const incident = await SecurityIncident.findOne({
        userId,
        relatedEvent: event._id
    });

    return {
        event: {
            id: event._id,
            eventType: event.eventType,
            timestamp: event.timestamp,
            ipAddress: event.ipAddress,
            location: event.location,
            device: event.device,
            browser: event.browser,
            timezone: event.timezone
        },

        risk: {
            score: event.riskScore,
            level: event.riskLevel,
            reasons: event.riskReasons || []
        },

        incident: incident
            ? {
                id: incident._id,
                status: incident.status,
                evidence: incident.evidence || []
            }
            : null
    };
};

module.exports = {
    getUserEvidence
};