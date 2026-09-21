const buildAuthenticationResponse = ({
    decision,
    risk,
    accountTakeover,
    behavior,
    credentialRisk,
    trust
}) => {

    return {
        success: decision.action === "ALLOW",

        action: decision.action,

        message: decision.message,

        risk,

        decision,

        accountTakeover,

        behavior,

        credentialRisk,

        trust: {
            score: trust.trustScore,
            level: trust.trustLevel
        }
    };
};

module.exports = {
    buildAuthenticationResponse
};