const SecurityIncident =
    require("../models/SecurityIncident");

const updateIncidentStatus = async ({
    incidentId,
    userId,
    status
}) => {

    const allowedStatuses = [
        "OPEN",
        "INVESTIGATING",
        "RESOLVED",
        "DISMISSED"
    ];

    if (!allowedStatuses.includes(status)) {
        return {
            error: "INVALID_STATUS"
        };
    }

    const incident =
        await SecurityIncident.findOne({
            _id: incidentId,
            userId
        });

    if (!incident) {
        return {
            error: "NOT_FOUND"
        };
    }

    incident.status = status;

    if (status === "RESOLVED") {
        incident.resolvedAt = new Date();
    } else {
        incident.resolvedAt = null;
    }

    await incident.save();

    return {
        incident
    };
};

module.exports = {
    updateIncidentStatus
};