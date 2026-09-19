const detectAccountTakeoverPattern = ({
    eventType,
    recentFailedAttempts,
    behaviorScore,
    isNewDevice,
    isNewLocation,
    credentialRiskScore,
    credentialRiskLevel
}) => {

    const indicators = [];
    let score = 0;

    if (recentFailedAttempts >= 3) {
        score += 25;
        indicators.push(
            "Multiple failed authentication attempts detected"
        );
    }

    if (
        eventType === "LOGIN_SUCCESS" &&
        recentFailedAttempts >= 3
    ) {
        score += 30;
        indicators.push(
            "Successful login occurred after multiple failed attempts"
        );
    }

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

    if (
        eventType === "LOGIN_SUCCESS" &&
        behaviorScore >= 70
    ) {
        score += 25;
        indicators.push(
            "Successful login occurred with highly anomalous behavior"
        );
    }

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

    if (
        credentialRiskLevel === "HIGH" &&
        credentialRiskScore > 0
    ) {
        indicators.push(
            "Credential appears in known exposure data"
        );
    }

    if (
        credentialRiskLevel === "HIGH" &&
        credentialRiskScore > 0 &&
        eventType === "LOGIN_SUCCESS" &&
        recentFailedAttempts >= 3
    ) {
        score += 25;
        indicators.push(
            "Successful login used a credential with known exposure risk after multiple failed attempts"
        );
    }

    score = Math.min(score, 100);

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

