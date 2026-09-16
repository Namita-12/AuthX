const {
    calculateRiskCorrelation
} = require("../risk-engine/riskCorrelationEngine");

const {
    decideAuthenticationAction
} = require("../risk-engine/authenticationDecisionEngine");

const evaluateAuthenticationRisk = (securitySignals) => {

    // 1. Calculate overall risk
    const risk =
        calculateRiskCorrelation(
            securitySignals
        );

    // 2. Convert risk into an authentication decision
    const decision =
        decideAuthenticationAction(
            risk.level
        );

    return {
        risk,
        decision
    };
};

module.exports = {
    evaluateAuthenticationRisk
};