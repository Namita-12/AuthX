function calculateRisk(event) {
    let score = 0;
    const reasons = [];
    const contributions = [];

    // -----------------------------------------
    // 1. FAILED LOGIN
    // -----------------------------------------

    if (event.eventType === "LOGIN_FAILED") {
        score += 25;

        reasons.push("Login attempt failed");

        contributions.push({
            signal: "Failed login",
            points: 25,
            explanation:
                "The authentication attempt failed."
        });
    }

    // -----------------------------------------
    // 2. NEW DEVICE
    // -----------------------------------------

    if (event.isNewDevice === true) {
        score += 20;

        reasons.push("Login from a new device");

        contributions.push({
            signal: "New device",
            points: 20,
            explanation:
                "The login originated from a device not seen in the user's baseline."
        });
    }

    // -----------------------------------------
    // 3. NEW LOCATION
    // -----------------------------------------

    if (event.isNewLocation === true) {
        score += 20;

        reasons.push("Login from a new location");

        contributions.push({
            signal: "New location",
            points: 20,
            explanation:
                "The login originated from a location outside the user's normal baseline."
        });
    }

    // -----------------------------------------
    // 4. UNUSUAL LOGIN TIME
    // -----------------------------------------

    if (event.isUnusualTime === true) {
        score += 15;

        reasons.push(
            "Login occurred at an unusual time"
        );

        contributions.push({
            signal: "Unusual login time",
            points: 15,
            explanation:
                "The authentication occurred outside the user's normal login-time pattern."
        });
    }

    // -----------------------------------------
    // 5. MULTIPLE FAILED ATTEMPTS
    // -----------------------------------------

    if (event.recentFailedAttempts >= 3) {
        score += 25;

        reasons.push(
            "Multiple recent failed login attempts"
        );

        contributions.push({
            signal: "Multiple failed attempts",
            points: 25,
            explanation:
                "Three or more recent failed authentication attempts were detected."
        });
    }

    // -----------------------------------------
    // 6. BRUTE-FORCE ATTACK DETECTION
    // -----------------------------------------

    if (event.recentFailedAttempts >= 4) {
        score += 30;

        reasons.push(
            "Possible brute-force attack detected"
        );

        contributions.push({
            signal: "Possible brute-force attack",
            points: 30,
            explanation:
                "Four or more recent failed attempts indicate possible automated credential guessing."
        });
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
        reasons,
        contributions
    };
}

module.exports = {
    calculateRisk
};
