require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});
const mongoose = require("mongoose");

const SecurityIncident =
    require("../models/SecurityIncident");

const AuthEvent =
    require("../models/AuthEvent");

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
                userId: "incident_test_user",
                eventType: "LOGIN_BLOCKED",
                ipAddress: "45.120.50.20",

                location: {
                    country: "Germany",
                    city: "Berlin"
                },

                device: "Unknown Linux Device",
                browser: "Firefox",
                timezone: "Europe/Berlin",

                riskScore: 95,
                riskLevel: "CRITICAL",

                riskReasons: [
                    "Multiple failed authentication attempts detected",
                    "New device detected",
                    "Credential exposure detected"
                ]
            });

        console.log(
            "\nAuth event created:"
        );

        console.log(authEvent._id);

        const incident =
            await SecurityIncident.create({
                userId: "incident_test_user",

                incidentType:
                    "POSSIBLE_ACCOUNT_TAKEOVER",

                severity: "CRITICAL",

                riskScore: 95,

                status: "OPEN",

                evidence: [
                    "Multiple failed authentication attempts detected",
                    "Successful login occurred after multiple failed attempts",
                    "New device detected",
                    "Credential appears in known exposure data"
                ],

                relatedEventId:
                    authEvent._id
            });

        console.log(
            "\nSecurity incident created:"
        );

        console.log(incident);

        const foundIncident =
            await SecurityIncident.findById(
                incident._id
            ).populate("relatedEventId");

        console.log(
            "\nRetrieved incident with related event:"
        );

        console.log(foundIncident);

        foundIncident.status =
            "INVESTIGATING";

        await foundIncident.save();

        console.log(
            "\nIncident status updated:"
        );

        console.log(foundIncident.status);

        foundIncident.status =
            "RESOLVED";

        foundIncident.resolvedAt =
            new Date();

        await foundIncident.save();

        console.log(
            "\nIncident resolved:"
        );

        console.log({
            status: foundIncident.status,
            resolvedAt:
                foundIncident.resolvedAt
        });

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
            "\nSecurity incident test failed:",
            error
        );

    } finally {

        await mongoose.disconnect();

    }
};

runTest();