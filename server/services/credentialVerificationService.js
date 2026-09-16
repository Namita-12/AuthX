const crypto = require("crypto");

// Synthetic development account
const syntheticUser = {
    userId: "user_001",

    // SHA-256 hash of the synthetic password:
    // "example-password"
    passwordHash:
        "a4b7fbda9179055ba005b83fe1d9d558c85e5f6afc2ce4071439ecdab864b98e"
};

const hashCredential = (credential) => {
    return crypto
        .createHash("sha256")
        .update(credential)
        .digest("hex");
};

const verifyCredential = (userId, credential) => {

    if (userId !== syntheticUser.userId) {
        return false;
    }

    const suppliedHash =
        hashCredential(credential);

    return suppliedHash ===
        syntheticUser.passwordHash;
};

module.exports = {
    verifyCredential
};