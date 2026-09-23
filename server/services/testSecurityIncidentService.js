require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});

const mongoose = require("mongoose");

const AuthEvent =
    require("../models/AuthEvent");

const SecurityIncident =
    require("../models/SecurityIncident");

const {
    createSecurityIncident
} = require("./securityIncidentService");


const runTest = async () => {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected successfully"
        );


        // Create a synthetic authentication event
        const authEvent =
            await AuthEvent.create({

                userId: "incident_service_test",

                eventType:
                    "LOGIN_BLOCKED",

                ipAddress:
                    "45.120.50.20",

                location: {
                    country: "Germany",
                    city: "Berlin"
                },

                device:
                    "Unknown Linux Device",

                browser:
                    "Firefox",

                timezone:
                    "Europe/Berlin",

                riskScore: 100,

                riskLevel:
                    "CRITICAL",

                riskReasons: [
                    "Multiple failed authentication attempts",
                    "New device detected",
                    "Credential exposure detected"
                ]
            });


        console.log(
            "\nAuthEvent created:",
            authEvent._id
        );


        // Synthetic ATO result
        const accountTakeover = {

            detected: true,

            detectionType:
                "POSSIBLE_ACCOUNT_TAKEOVER",

            score: 100,

            level: "HIGH",

            indicators: [
                "Multiple failed authentication attempts",
                "Successful login after failures",
                "New device detected"
            ]
        };


        // Synthetic risk result
        const risk = {

            score: 100,

            level: "CRITICAL",

            evidence: [
                "Multiple failed authentication attempts detected",
                "Successful login occurred after multiple failed attempts",
                "Credential appears in known exposure data"
            ]
        };


     const incident =
    await createSecurityIncident({

        userId:
            "incident_service_test",

        accountTakeover,

        risk,

        eventId:
            authEvent._id

    });


console.log(
    "\nFirst incident:"
);

console.log(incident);


// Try creating the same incident again
const duplicateIncident =
    await createSecurityIncident({

        userId:
            "incident_service_test",

        accountTakeover,

        risk: {
            score: 90,
            level: "CRITICAL",
            evidence: [
                "Another suspicious authentication attempt"
            ]
        },

        eventId:
            authEvent._id

    });


console.log(
    "\nSecond incident attempt:"
);

console.log(duplicateIncident);


// Verify both references point to the same incident
console.log(
    "\nDuplicate prevented:"
);

console.log(
    incident._id.equals(
        duplicateIncident._id
    )
);


// Verify it exists in MongoDB
const storedIncident =
    await SecurityIncident.findById(
        incident._id
    ).populate("relatedEventId");


console.log(
    "\nStored incident:"
);

console.log(storedIncident);


// Test normal authentication
const normalResult =
    await createSecurityIncident({

        userId:
            "incident_service_test",

        accountTakeover: {
            detected: false
        },

        risk: {
            score: 0,
            level: "LOW",
            evidence: []
        },

        eventId:
            authEvent._id

    });


console.log(
    "\nNormal authentication result:"
);

console.log(normalResult);


// Cleanup
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
            "\nSecurity incident service test failed:",
            error
        );

    } finally {

        await mongoose.disconnect();

    }
};


runTest();