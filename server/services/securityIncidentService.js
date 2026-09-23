const SecurityIncident =
    require("../models/SecurityIncident");

const createSecurityIncident = async ({
    userId,
    accountTakeover,
    risk,
    eventId
}) => {

    if (!accountTakeover?.detected) {
        return null;
    }

    const existingIncident =
        await SecurityIncident.findOne({
            userId,
            incidentType:
                accountTakeover.detectionType,
            status: "OPEN"
        });

    if (existingIncident) {

        return existingIncident;
    }

    const incident =
        await SecurityIncident.create({

            userId,

            incidentType:
                accountTakeover.detectionType,

            severity:
                risk.level,

            riskScore:
                risk.score,

            status: "OPEN",

            evidence:
                risk.evidence,

            relatedEventId:
                eventId

        });

    return incident;
};

module.exports = {
    createSecurityIncident
};