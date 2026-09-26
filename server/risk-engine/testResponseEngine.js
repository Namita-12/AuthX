const {
    generateResponseActions
} = require("./responseEngine");

console.log("\nTest 1: Normal authentication");

const normal =
    generateResponseActions({
        riskLevel: "LOW",
        accountTakeoverDetected: false,
        credentialRiskLevel: "LOW"
    });

console.log(normal);


console.log("\nTest 2: Medium-risk authentication");

const medium =
    generateResponseActions({
        riskLevel: "MEDIUM",
        accountTakeoverDetected: false,
        credentialRiskLevel: "LOW"
    });

console.log(medium);


console.log("\nTest 3: High-risk authentication");

const high =
    generateResponseActions({
        riskLevel: "HIGH",
        accountTakeoverDetected: false,
        credentialRiskLevel: "HIGH"
    });

console.log(high);


console.log("\nTest 4: Critical account takeover");

const critical =
    generateResponseActions({
        riskLevel: "CRITICAL",
        accountTakeoverDetected: true,
        credentialRiskLevel: "HIGH"
    });

console.log(critical);