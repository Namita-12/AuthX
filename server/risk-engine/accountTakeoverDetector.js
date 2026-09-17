const detectAccountTakeoverPattern = ({
    eventType,
    recentFailedAttempts,
    behaviorScore,
    isNewDevice,
    isNewLocation
}) => {

    const indicators = [];
    let score = 0;

    // --------------------------------
    // 1. Credential attack activity
    // --------------------------------

    if (recentFailedAttempts >= 3) {
        score += 25;

        indicators.push(
            "Multiple failed authentication attempts detected"
        );
    }

    // --------------------------------
    // 2. Successful login after failures
    // --------------------------------

    if (
        eventType === "LOGIN_SUCCESS" &&
        recentFailedAttempts >= 3
    ) {
        score += 30;

        indicators.push(
            "Successful login occurred after multiple failed attempts"
        );
    }

    // --------------------------------
    // 3. New device after failures
    // --------------------------------

    if (
        eventType === "LOGIN_SUCCESS" &&
        recentFailedAttempts >= 3 &&
        isNewDevice === true
    ) {
        score += 20;

        indicators.push(
            "Successful login after failures came from a new device"
        );
    }

    // --------------------------------
    // 4. New location after failures
    // --------------------------------

    if (
        eventType === "LOGIN_SUCCESS" &&
        recentFailedAttempts >= 3 &&
        isNewLocation === true
    ) {
        score += 20;

        indicators.push(
            "Successful login after failures came from a new location"
        );
    }

    // --------------------------------
    // 5. Highly anomalous successful login
    // --------------------------------

    if (
        eventType === "LOGIN_SUCCESS" &&
        behaviorScore >= 70
    ) {
        score += 25;

        indicators.push(
            "Successful login occurred with highly anomalous behavior"
        );
    }

    // --------------------------------
    // 6. New device + location
    // --------------------------------

    if (
        eventType === "LOGIN_SUCCESS" &&
        isNewDevice === true &&
        isNewLocation === true
    ) {
        score += 20;

        indicators.push(
            "Successful login came from both a new device and new location"
        );
    }

    score = Math.min(score, 100);

    // --------------------------------
    // Determine detection type
    // --------------------------------

    let detectionType;

    if (
        eventType === "LOGIN_SUCCESS" &&
        recentFailedAttempts >= 3
    ) {
        detectionType = "POSSIBLE_ACCOUNT_TAKEOVER";
    } else if (
        eventType === "LOGIN_FAILED" &&
        recentFailedAttempts >= 3
    ) {
        detectionType = "CREDENTIAL_ATTACK";
    } else if (
        eventType === "LOGIN_SUCCESS" &&
        (isNewDevice === true || isNewLocation === true)
    ) {
        detectionType = "AUTHENTICATION_ANOMALY";
    } else {
        detectionType = "NORMAL";
    }

    // --------------------------------
    // Determine severity
    // --------------------------------

    let level;

    if (score >= 80) {
        level = "HIGH";
    } else if (score >= 50) {
        level = "MEDIUM";
    } else {
        level = "LOW";
    }

    return {
        detected: score >= 50,
        detectionType,
        score,
        level,
        indicators
    };
};

module.exports = {
    detectAccountTakeoverPattern
};