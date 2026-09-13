const { calculateRisk } = require("./riskEngine");

const testEvent = {
    eventType: "LOGIN_SUCCESS",
    isNewDevice: true,
    isNewLocation: true,
    isUnusualTime: true,
    recentFailedAttempts: 0
};

const result = calculateRisk(testEvent);

console.log("AuthX Risk Analysis");
console.log("-------------------");
console.log("Risk Score:", result.score);
console.log("Risk Level:", result.level);
console.log("Reasons:", result.reasons);