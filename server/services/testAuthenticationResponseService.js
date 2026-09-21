const {
    buildAuthenticationResponse
} = require("./authenticationResponseService");

const testResponse =
    buildAuthenticationResponse({

        decision: {
            action: "REQUIRE_ADDITIONAL_AUTHENTICATION",
            requiresAdditionalAuthentication: true,
            message: "Additional authentication is recommended"
        },

        risk: {
            score: 55,
            level: "MEDIUM"
        },

        accountTakeover: {
            detected: false,
            detectionType: "AUTHENTICATION_ANOMALY",
            score: 20,
            level: "LOW"
        },

        behavior: {
            score: 35,
            status: "SUSPICIOUS"
        },

        credentialRisk: {
            exposed: false,
            score: 0,
            level: "LOW"
        },

        trust: {
            trustScore: 58,
            trustLevel: "CAUTION"
        }

    });

console.log(
    "Authentication response:"
);

console.log(
    JSON.stringify(
        testResponse,
        null,
        2
    )
);