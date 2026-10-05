const AuthEvent = require("../models/AuthEvent");
const SecurityIncident = require("../models/SecurityIncident");
const ResponseAction = require("../models/ResponseAction");

const getSecurityTimeline = async (
    userId,
    page = 1,
    limit = 20
) => {
    const skip = (page - 1) * limit;

    const [
        events,
        incidents,
        responses
    ] = await Promise.all([
        AuthEvent.find({ userId })
            .sort({ timestamp: -1 })
            .lean(),

        SecurityIncident.find({ userId })
            .sort({ detectedAt: -1 })
            .lean(),

        ResponseAction.find({ userId })
            .sort({ createdAt: -1 })
            .lean()
    ]);

    const timeline = [
        ...events.map(event => ({
            type: "AUTH_EVENT",
            timestamp: event.timestamp,
            data: event
        })),

        ...incidents.map(incident => ({
            type: "SECURITY_INCIDENT",
            timestamp: incident.detectedAt,
            data: incident
        })),

        ...responses.map(response => ({
            type: "RESPONSE_ACTION",
            timestamp: response.createdAt,
            data: response
        }))
    ]
        .sort(
            (a, b) =>
                new Date(b.timestamp) -
                new Date(a.timestamp)
        );

    const total = timeline.length;

    return {
        timeline: timeline.slice(
            skip,
            skip + limit
        ),
        total
    };
};

module.exports = {
    getSecurityTimeline
};