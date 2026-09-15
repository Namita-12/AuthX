const crypto = require("crypto");

const exposedCredentials = require("./credentialExposureData");

const hashCredential = (credential) => {
    return crypto
        .createHash("sha256")
        .update(credential)
        .digest("hex");
};

const checkCredentialExposure = (credential) => {
    const hash = hashCredential(credential);

    const isExposed = exposedCredentials.has(hash);

    return {
        exposed: isExposed,
        hash
    };
};

const calculateCredentialRisk = (exposed) => {
    if (exposed === true) {
        return {
            score: 40,
            level: "HIGH",
            reason: "Credential appears in known exposure data"
        };
    }

    return {
        score: 0,
        level: "LOW",
        reason: "No credential exposure detected"
    };
};

module.exports = {
    hashCredential,
    checkCredentialExposure,
    calculateCredentialRisk
};