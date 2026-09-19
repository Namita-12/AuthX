const calculateTrustScore = ({
    previousTrust,
    eventType,
    behaviorScore = 0,
    isNewDevice = false,
    isNewLocation = false,
    recentFailedAttempts = 0,
    credentialRiskLevel = "LOW",
    accountTakeoverDetected = false
}) => {

    let trust = previousTrust;

    // --------------------------------
    // Positive signals
    // --------------------------------

    if (eventType === "LOGIN_SUCCESS") {
        trust += 5;
    }

    if (
        eventType === "LOGIN_SUCCESS" &&
        !isNewDevice
    ) {
        trust += 3;
    }

    if (
        eventType === "LOGIN_SUCCESS" &&
        !isNewLocation
    ) {
        trust += 3;
    }

    if (
        eventType === "LOGIN_SUCCESS" &&
        behaviorScore < 30
    ) {
        trust += 2;
    }

    // --------------------------------
    // Negative signals
    // --------------------------------

    if (eventType === "LOGIN_FAILED") {
        trust -= 5;
    }

    if (isNewDevice) {
        trust -= 10;
    }

    if (isNewLocation) {
        trust -= 10;
    }

    if (behaviorScore >= 60) {
        trust -= 10;
    }

    if (recentFailedAttempts >= 3) {
        trust -= 15;
    }

    if (credentialRiskLevel === "HIGH") {
        trust -= 20;
    }

    if (accountTakeoverDetected) {
        trust -= 25;
    }

    // --------------------------------
    // Keep score between 0 and 100
    // --------------------------------

    trust = Math.max(
        0,
        Math.min(100, trust)
    );

    // --------------------------------
    // Determine trust level
    // --------------------------------

    let level;

    if (trust >= 80) {
        level = "TRUSTED";
    } else if (trust >= 60) {
        level = "NORMAL";
    } else if (trust >= 40) {
        level = "CAUTION";
    } else if (trust >= 20) {
        level = "LOW_TRUST";
    } else {
        level = "UNTRUSTED";
    }

    return {
        score: trust,
        level
    };
};

module.exports = {
    calculateTrustScore
};