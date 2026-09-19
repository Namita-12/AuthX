const {
    calculateRiskCorrelation
} = require("../risk-engine/riskCorrelationEngine");

const {
    decideAuthenticationAction
} = require("../risk-engine/authenticationDecisionEngine");

const {
    detectAccountTakeoverPattern
} = require("../risk-engine/accountTakeoverDetector");
const {
    calculateTrustScore
} = require("../risk-engine/trustScoreEngine");

const evaluateAuthenticationRisk = ({
    eventType,
    behavior,
    recentFailedAttempts,
    credentialRisk
}) => {

    // --------------------------------
    // 1. Risk correlation
    // --------------------------------

    const risk = calculateRiskCorrelation({
        behaviorScore: behavior.score,
        behaviorStatus: behavior.status,
        behaviorConfidence: behavior.confidence,
        behaviorSignals: behavior.signals,

        eventType,

        recentFailedAttempts,

        credentialRiskScore:
            credentialRisk?.score ?? 0,

        credentialRiskLevel:
            credentialRisk?.level ?? "LOW",

        credentialRiskReason:
            credentialRisk?.reason ??
            "No credential exposure detected"
    });

    // --------------------------------
    // 2. Authentication decision
    // --------------------------------

    const decision =
        decideAuthenticationAction(
            risk.level
        );

    // --------------------------------
    // 3. Account takeover detection
    // --------------------------------

    const accountTakeover =
        detectAccountTakeoverPattern({

            eventType,

            recentFailedAttempts,

            behaviorScore:
                behavior.score,

            isNewDevice:
                behavior.isNewDevice,

            isNewLocation:
                behavior.isNewLocation,

            credentialRiskScore:
                credentialRisk?.score ?? 0,

            credentialRiskLevel:
                credentialRisk?.level ?? "LOW"

        });
            // --------------------------------
    // 4. Adaptive trust score
    // --------------------------------

    const trust = calculateTrustScore({

        previousTrust: 70,

        eventType,

        behaviorScore:
            behavior.score,

        isNewDevice:
            behavior.isNewDevice,

        isNewLocation:
            behavior.isNewLocation,

        recentFailedAttempts,

        credentialRiskLevel:
            credentialRisk?.level ?? "LOW",

        accountTakeoverDetected:
            accountTakeover.detected

    });

    return {
    risk,
    decision,
    accountTakeover,
    trust
};
};

module.exports = {
    evaluateAuthenticationRisk
};