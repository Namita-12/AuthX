const {
    calculateRiskCorrelation
} = require("./riskCorrelationEngine");


// ========================================
// TEST 1 — NORMAL LOGIN
// ========================================

const normalLogin = {
    behaviorScore: 0,
    behaviorStatus: "NORMAL",
    behaviorConfidence: "HIGH",
    behaviorSignals: [],

    eventType: "LOGIN_SUCCESS",
    recentFailedAttempts: 0
};


// ========================================
// TEST 2 — LEGITIMATE TRAVELER
// ========================================

const travelerLogin = {
    behaviorScore: 50,
    behaviorStatus: "SUSPICIOUS",
    behaviorConfidence: "MEDIUM",

    behaviorSignals: [
        "New device detected",
        "New location detected"
    ],

    eventType: "LOGIN_SUCCESS",
    recentFailedAttempts: 0
};


// ========================================
// TEST 3 — SUSPICIOUS SUCCESSFUL LOGIN
// ========================================

const suspiciousLogin = {
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
    recentFailedAttempts: 0
};


// ========================================
// TEST 4 — BRUTE FORCE + SUCCESS
// ========================================

const bruteForceLogin = {
    behaviorScore: 85,
    behaviorStatus: "ANOMALOUS",
    behaviorConfidence: "HIGH",

    behaviorSignals: [
        "New device detected",
        "New location detected",
        "New browser detected",
        "Unusual login time"
    ],

    eventType: "LOGIN_SUCCESS",
    recentFailedAttempts: 5
};


// ========================================
// RUN TESTS
// ========================================

console.log("\n==============================");
console.log("AUTHX RISK CORRELATION TESTS");
console.log("==============================");


console.log("\n🟢 NORMAL LOGIN");

console.log(
    calculateRiskCorrelation(normalLogin)
);


console.log("\n🧳 LEGITIMATE TRAVELER");

console.log(
    calculateRiskCorrelation(travelerLogin)
);


console.log("\n🔴 SUSPICIOUS SUCCESSFUL LOGIN");

console.log(
    calculateRiskCorrelation(suspiciousLogin)
);


console.log("\n💥 BRUTE FORCE + SUCCESS");

console.log(
    calculateRiskCorrelation(bruteForceLogin)
);