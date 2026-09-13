const { analyzeBehavior } = require("./behaviorAnalyzer");

const baseline = {
    totalSuccessfulLogins: 6,
    devices: ["Windows Laptop"],
    cities: ["Bengaluru"],
    browsers: ["Chrome"],
    loginHours: [18, 19, 18, 20, 19, 18]
};

const normalEvent = {
    device: "Windows Laptop",
    location: {
        city: "Bengaluru"
    },
    browser: "Chrome",
    timestamp: new Date(),
    timezone: "Asia/Kolkata"
};

const suspiciousEvent = {
    device: "Linux Laptop",
    location: {
        city: "Berlin"
    },
    browser: "Firefox",
    timestamp: new Date(),
    timezone: "Europe/Berlin"
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