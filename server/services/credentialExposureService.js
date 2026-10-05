const crypto = require("crypto");

const exposedCredentials = new Set([
    crypto
        .createHash("sha256")
        .update("synthetic-exposed-password")
        .digest("hex")
]);

const checkCredentialExposure = (credential) => {
    const hash = crypto
        .createHash("sha256")
        .update(credential)
        .digest("hex");

    const exposed = exposedCredentials.has(hash);

    return {
        exposed,
        severity: exposed ? "HIGH" : "LOW",
        riskScore: exposed ? 40 : 0,
        explanation: exposed
            ? "Credential matches a known exposed credential pattern."
            : "No match found in the configured exposure dataset."
    };
};

module.exports = {
    checkCredentialExposure
};