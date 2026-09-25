require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});

const mongoose = require("mongoose");

const AuthEvent =
    require("../models/AuthEvent");

const SecurityIncident =
    require("../models/SecurityIncident");

const {
    updateIncidentStatus
} = require("./incidentStatusService");

const runTest = async () => {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected successfully"
        );

        const authEvent =
            await AuthEvent.create({
                userId: "incident_status_test",
                eventType: "LOGIN_BLOCKED",
                ipAddress: "45.120.50.20",
                location: {
                    country: "Germany",
                    city: "Berlin"
                },
                device: "Unknown Linux Device",
                browser: "Firefox",
                timezone: "Europe/Berlin",
                riskScore: 100,
                riskLevel: "CRITICAL",
                riskReasons: [
                    "Possible account takeover detected"
                ]
            });

        const incident =
            await SecurityIncident.create({
                userId: "incident_status_test",

                incidentType:
                    "POSSIBLE_ACCOUNT_TAKEOVER",

                severity: "CRITICAL",

                riskScore: 100,

                status: "OPEN",

                evidence: [
                    "Multiple failed authentication attempts"
                ],

                relatedEventId:
                    authEvent._id
            });

        console.log(
            "\nInitial status:",
            incident.status
        );

        const investigating =
            await updateIncidentStatus({
                incidentId:
                    incident._id,

                userId:
                    "incident_status_test",

                status:
                    "INVESTIGATING"
            });

        console.log(
            "After investigation:",
            investigating.incident.status
        );

        const resolved =
            await updateIncidentStatus({
                incidentId:
                    incident._id,

                userId:
                    "incident_status_test",

                status:
                    "RESOLVED"
            });

        console.log(
            "After resolution:",
            resolved.incident.status
        );

        console.log(
            "Resolved at:",
            resolved.incident.resolvedAt
        );

        const reopened =
            await updateIncidentStatus({
                incidentId:
                    incident._id,

                userId:
                    "incident_status_test",

                status:
                    "OPEN"
            });

        console.log(
            "After reopening:",
            reopened.incident.status
        );

        console.log(
            "Resolved at after reopening:",
            reopened.incident.resolvedAt
        );

        const invalidStatus =
            await updateIncidentStatus({
                incidentId:
                    incident._id,

                userId:
                    "incident_status_test",

                status:
                    "INVALID"
            });

        console.log(
            "Invalid status result:",
            invalidStatus.error
        );

        const unauthorized =
            await updateIncidentStatus({
                incidentId:
                    incident._id,

                userId:
                    "different_user",

                status:
                    "RESOLVED"
            });

        console.log(
            "Unauthorized result:",
            unauthorized.error
        );

        await SecurityIncident.deleteOne({
            _id: incident._id
        });

        await AuthEvent.deleteOne({
            _id: authEvent._id
        });

        console.log(
            "\nTest data cleaned up successfully."
        );

    } catch (error) {

        console.error(
            "Test failed:",
            error
        );

    } finally {

        await mongoose.disconnect();

    }
};

runTest();