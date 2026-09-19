const {
    evaluateAuthenticationRisk
} = require("./authenticationRiskService");

console.log(
    "\n=== AUTHENTICATION RISK INTEGRATION TEST ==="
);

const result =
    evaluateAuthenticationRisk({

        eventType: "LOGIN_SUCCESS",

        behavior: {
            score: 85,
            status: "ANOMALOUS",
            confidence: "MEDIUM",
            signals: [
                "New device detected",
                "New location detected"
            ],
            isNewDevice: true,
            isNewLocation: true
        },

        recentFailedAttempts: 5,

        credentialRisk: {
            exposed: true,
            score: 40,
            level: "HIGH",
            reason:
                "Credential appears in known exposure data"
        }

    });

console.log(
    JSON.stringify(
        result,
        null,
        2
    )
);