const {
    detectAccountTakeoverPattern
} = require("./accountTakeoverDetector");

console.log("\n==============================");
console.log("AUTHX ACCOUNT TAKEOVER TESTS");
console.log("==============================");


console.log("\n🟢 NORMAL LOGIN");

console.log(
    detectAccountTakeoverPattern({
        eventType: "LOGIN_SUCCESS",
        recentFailedAttempts: 0,
        behaviorScore: 0,
        isNewDevice: false,
        isNewLocation: false
    })
);


console.log("\n🧳 LEGITIMATE TRAVELER");

console.log(
    detectAccountTakeoverPattern({
        eventType: "LOGIN_SUCCESS",
        recentFailedAttempts: 0,
        behaviorScore: 50,
        isNewDevice: true,
        isNewLocation: true
    })
);


console.log("\n🔴 BRUTE FORCE + SUCCESS");

console.log(
    detectAccountTakeoverPattern({
        eventType: "LOGIN_SUCCESS",
        recentFailedAttempts: 5,
        behaviorScore: 85,
        isNewDevice: true,
        isNewLocation: true
    })
);


console.log("\n🔐 STOLEN CREDENTIAL SCENARIO");

console.log(
    detectAccountTakeoverPattern({
        eventType: "LOGIN_SUCCESS",
        recentFailedAttempts: 0,
        behaviorScore: 85,
        isNewDevice: true,
        isNewLocation: true
    })
);


console.log("\n❌ FAILED LOGIN BURST");

console.log(
    detectAccountTakeoverPattern({
        eventType: "LOGIN_FAILED",
        recentFailedAttempts: 5,
        behaviorScore: 20,
        isNewDevice: false,
        isNewLocation: false
    })
);