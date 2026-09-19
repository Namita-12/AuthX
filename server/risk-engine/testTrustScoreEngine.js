const {
    calculateTrustScore
} = require("./trustScoreEngine");

console.log("=== TRUST SCORE ENGINE TESTS ===");


// --------------------------------
// Test 1: Normal successful login
// --------------------------------

const normalLogin = calculateTrustScore({
    previousTrust: 70,
    eventType: "LOGIN_SUCCESS",
    behaviorScore: 10,
    isNewDevice: false,
    isNewLocation: false,
    recentFailedAttempts: 0,
    credentialRiskLevel: "LOW",
    accountTakeoverDetected: false
});

console.log("\nTest 1: Normal Login");
console.log(normalLogin);


// --------------------------------
// Test 2: Suspicious login
// --------------------------------

const suspiciousLogin = calculateTrustScore({
    previousTrust: 80,
    eventType: "LOGIN_SUCCESS",
    behaviorScore: 75,
    isNewDevice: true,
    isNewLocation: true,
    recentFailedAttempts: 0,
    credentialRiskLevel: "LOW",
    accountTakeoverDetected: false
});

console.log("\nTest 2: Suspicious Login");
console.log(suspiciousLogin);


// --------------------------------
// Test 3: Account takeover scenario
// --------------------------------

const takeoverLogin = calculateTrustScore({
    previousTrust: 80,
    eventType: "LOGIN_SUCCESS",
    behaviorScore: 85,
    isNewDevice: true,
    isNewLocation: true,
    recentFailedAttempts: 5,
    credentialRiskLevel: "HIGH",
    accountTakeoverDetected: true
});

console.log("\nTest 3: Account Takeover");
console.log(takeoverLogin);


// --------------------------------
// Test 4: Score cannot exceed 100
// --------------------------------

const upperLimit = calculateTrustScore({
    previousTrust: 98,
    eventType: "LOGIN_SUCCESS",
    behaviorScore: 0,
    isNewDevice: false,
    isNewLocation: false,
    recentFailedAttempts: 0,
    credentialRiskLevel: "LOW",
    accountTakeoverDetected: false
});

console.log("\nTest 4: Upper Limit");
console.log(upperLimit);


// --------------------------------
// Test 5: Score cannot go below 0
// --------------------------------

const lowerLimit = calculateTrustScore({
    previousTrust: 5,
    eventType: "LOGIN_SUCCESS",
    behaviorScore: 90,
    isNewDevice: true,
    isNewLocation: true,
    recentFailedAttempts: 10,
    credentialRiskLevel: "HIGH",
    accountTakeoverDetected: true
});

console.log("\nTest 5: Lower Limit");
console.log(lowerLimit);