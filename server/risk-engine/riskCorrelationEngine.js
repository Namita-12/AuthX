const calculateRiskCorrelation = ({
    behaviorScore,
    behaviorStatus,
    behaviorConfidence,
    behaviorSignals,
    eventType,
    recentFailedAttempts
}) => {

    let score = 0;
    const evidence = [];
    const actions = [];

    // --------------------------------
    // 1. BEHAVIORAL ANOMALY
    // --------------------------------

    if (behaviorStatus === "SUSPICIOUS") {
        score += 25;

        evidence.push(
            "Authentication behavior differs from the user's normal pattern"
        );
    }

    if (behaviorStatus === "ANOMALOUS") {
        score += 40;

        evidence.push(
            "Authentication behavior is highly unusual for this user"
        );
    }

    // --------------------------------
    // 2. FAILED LOGIN PATTERN
    // --------------------------------

    if (recentFailedAttempts >= 3) {
        score += 20;

        evidence.push(
            `${recentFailedAttempts} failed login attempts detected recently`
        );
    }

    if (recentFailedAttempts >= 5) {
        score += 15;

        evidence.push(
            "Repeated authentication failures may indicate credential attack activity"
        );
    }

    // --------------------------------
    // 3. SUCCESS AFTER FAILED ATTEMPTS
    // --------------------------------

    if (
        eventType === "LOGIN_SUCCESS" &&
        recentFailedAttempts >= 3
    ) {
        score += 20;

        evidence.push(
            "Successful authentication occurred after multiple failed attempts"
        );

        actions.push(
            "Require additional authentication"
        );
    }

    // --------------------------------
    // 4. HIGH BEHAVIORAL ANOMALY
    // --------------------------------

    if (
        behaviorScore >= 70 &&
        eventType === "LOGIN_SUCCESS"
    ) {
        evidence.push(
            "Successful login occurred despite highly anomalous behavior"
        );

        actions.push(
            "Require additional authentication"
        );
    }

    // --------------------------------
    // 5. LIMIT SCORE
    // --------------------------------

    score = Math.min(score, 100);

    // --------------------------------
    // 6. FINAL RISK LEVEL
    // --------------------------------

    let level;

    if (score >= 80) {
        level = "CRITICAL";
    } else if (score >= 60) {
        level = "HIGH";
    } else if (score >= 30) {
        level = "MEDIUM";
    } else {
        level = "LOW";
    }

    // --------------------------------
    // 7. DEFAULT ACTION
    // --------------------------------

    if (level === "CRITICAL") {
        actions.push(
            "Review account activity and consider session revocation"
        );
    } else if (level === "HIGH") {
        actions.push(
            "Monitor account and require stronger verification"
        );
    } else if (level === "MEDIUM") {
        actions.push(
            "Monitor authentication activity"
        );
    }

    // Remove duplicate actions
    const uniqueActions = [...new Set(actions)];

    return {
        score,
        level,
        confidence: behaviorConfidence,
        evidence,
        recommendedActions: uniqueActions
    };
};

module.exports = {
    calculateRiskCorrelation
};