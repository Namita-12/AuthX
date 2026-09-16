const {
    verifyCredential
} = require("./credentialVerificationService");

const {
    checkCredentialExposure,
    calculateCredentialRisk
} = require("./credentialRiskService");

const authenticateUser = (
    userId,
    credential
) => {

    // 1. Verify the credential
    const isValid =
        verifyCredential(
            userId,
            credential
        );

    // Stop if authentication failed
    if (!isValid) {
        return {
            authenticated: false,
            credentialRisk: null
        };
    }

    // 2. Check credential exposure
    const exposureResult =
        checkCredentialExposure(
            credential
        );

    // 3. Calculate credential risk
    const credentialRisk =
        calculateCredentialRisk(
            exposureResult.exposed
        );

    return {
        authenticated: true,

        credentialRisk: {
            exposed:
                exposureResult.exposed,

            score:
                credentialRisk.score,

            level:
                credentialRisk.level,

            reason:
                credentialRisk.reason
        }
    };
};

module.exports = {
    authenticateUser
};