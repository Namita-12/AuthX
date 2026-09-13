const { analyzeBehavior } = require("./behaviorAnalyzer");

const baseline = {
    totalSuccessfulLogins: 6,
    devices: ["Windows Laptop"],
    cities: ["Bengaluru"],
    browsers: ["Chrome"],
    loginHours: [18, 19, 18, 20, 19, 18]
};

// Fixed normal login around 19:00 IST
const normalEvent = {
    device: "Windows Laptop",
    location: {
        city: "Bengaluru"
    },
    browser: "Chrome",
    timestamp: new Date(
        "2026-09-13T13:30:00.000Z"
    ),
    timezone: "Asia/Kolkata"
};

// Fixed suspicious login around 03:00 IST
const suspiciousEvent = {
    device: "Linux Laptop",
    location: {
        city: "Berlin"
    },
    browser: "Firefox",
    timestamp: new Date(
        "2026-09-13T21:30:00.000Z"
    ),
    timezone: "Asia/Kolkata"
};

console.log("\n=== NORMAL LOGIN TEST ===");

const normalResult = analyzeBehavior(
    normalEvent,
    baseline
);

console.log(normalResult);

console.log("\n=== SUSPICIOUS LOGIN TEST ===");

const suspiciousResult = analyzeBehavior(
    suspiciousEvent,
    baseline
);

console.log(suspiciousResult);