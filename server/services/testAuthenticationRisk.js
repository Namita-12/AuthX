const {
    evaluateAuthenticationRisk
} = require("./authenticationRiskService");

console.log(
    "\n=== AUTHENTICATION RISK INTEGRATION TEST ==="
);

const exposedAnomalousLogin = {
    behaviorScore: 85,
    behaviorStatus: "ANOMALOUS",
    behaviorConfidence: "MEDIUM",

    behaviorSignals: [
        "New device detected",
        "New location detected",
        "New browser detected",
        "Unusual login time"
    ],

    eventType: "LOGIN_SUCCESS",

    recentFailedAttempts: 0,

    credentialRiskScore: 40,
    credentialRiskLevel: "HIGH",

    credentialRiskReason:
        "Credential appears in known exposure data"
};

const result =
    evaluateAuthenticationRisk(
        exposedAnomalousLogin
    );

console.log(
    JSON.stringify(
        result,
        null,
        2
    )
);