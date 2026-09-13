function calculateRisk(event) {
    let score = 0;
    const reasons = [];

    // -----------------------------------------
    // 1. FAILED LOGIN
    // -----------------------------------------

    if (event.eventType === "LOGIN_FAILED") {
        score += 25;
        reasons.push("Login attempt failed");
    }

    // -----------------------------------------
    // 2. NEW DEVICE
    // -----------------------------------------

    if (event.isNewDevice === true) {
        score += 20;
        reasons.push("Login from a new device");
    }

    // -----------------------------------------
    // 3. NEW LOCATION
    // -----------------------------------------

    if (event.isNewLocation === true) {
        score += 20;
        reasons.push("Login from a new location");
    }

    // -----------------------------------------
    // 4. UNUSUAL LOGIN TIME
    // -----------------------------------------

    if (event.isUnusualTime === true) {
        score += 15;
        reasons.push("Login occurred at an unusual time");
    }

    // -----------------------------------------
    // 5. MULTIPLE FAILED ATTEMPTS
    // -----------------------------------------

    if (event.recentFailedAttempts >= 3) {
        score += 25;
        reasons.push("Multiple recent failed login attempts");
    }

    // -----------------------------------------
    // 6. BRUTE-FORCE ATTACK DETECTION
    // -----------------------------------------

    if (event.recentFailedAttempts >= 4) {
        score += 30;
        reasons.push("Possible brute-force attack detected");
    }

    // -----------------------------------------
    // CAP SCORE
    // -----------------------------------------

    score = Math.min(score, 100);

    // -----------------------------------------
    // DETERMINE RISK LEVEL
    // -----------------------------------------

    let level;

    if (score >= 70) {
        level = "HIGH";
    } else if (score >= 40) {
        level = "MEDIUM";
    } else {
        level = "LOW";
    }

    return {
        score,
        level,
        reasons
    };
}

module.exports = {
    calculateRisk
};