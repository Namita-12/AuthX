const calculateRiskCorrelation = ({
    behaviorScore,
    behaviorStatus,
    behaviorConfidence,
    behaviorSignals,
    eventType,
    recentFailedAttempts,
    credentialRiskScore,
    credentialRiskLevel,
    credentialRiskReason
}) => {

    let score = 0;
    const evidence = [];
    const actions = [];

    const riskFactors = {
        behavioralAnomaly: behaviorScore ?? 0,
        credentialExposure: credentialRiskScore ?? 0,
        recentFailedAttempts: recentFailedAttempts ?? 0
    };

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

    if (
        credentialRiskLevel === "HIGH" &&
        credentialRiskScore > 0
    ) {
        const credentialContribution = Math.round(
            credentialRiskScore * 0.75
        );

        score += credentialContribution;

        evidence.push(
            credentialRiskReason ||
            "Credential exposure risk detected"
        );

        if (eventType === "LOGIN_SUCCESS") {
            actions.push(
                "Consider credential reset"
            );
        }
    }

    score = Math.min(score, 100);

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

    const uniqueActions = [...new Set(actions)];

    return {
        score,
        level,
        confidence: behaviorConfidence,
        riskFactors,
        evidence,
        recommendedActions: uniqueActions
    };
};

module.exports = {
    calculateRiskCorrelation
};

