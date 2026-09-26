const generateResponseActions = ({
    riskLevel,
    accountTakeoverDetected,
    credentialRiskLevel
}) => {

    const actions = [];

    if (
        accountTakeoverDetected === true
    ) {
        actions.push("REVOKE_SESSIONS");
    }

    if (
        credentialRiskLevel === "HIGH"
    ) {
        actions.push("REQUIRE_CREDENTIAL_RESET");
    }

    if (
        riskLevel === "HIGH" ||
        riskLevel === "CRITICAL"
    ) {
        actions.push(
            "REQUIRE_ADDITIONAL_AUTHENTICATION"
        );
    }

    if (
        riskLevel === "CRITICAL" &&
        accountTakeoverDetected === true
    ) {
        actions.push("BLOCK_ACCOUNT_ACCESS");
    }

    return [...new Set(actions)];
};

module.exports = {
    generateResponseActions
};