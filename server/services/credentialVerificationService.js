const crypto = require("crypto");

// Synthetic development accounts
const syntheticUsers = [
    {
        userId: "user_001",

        // Synthetic exposed credential:
        // "example-password"
        passwordHash:
            "a4b7fbda9179055ba005b83fe1d9d558c85e5f6afc2ce4071439ecdab864b98e"
    },

    {
        userId: "user_002",

        // Synthetic non-exposed credential:
        // "another-synthetic-password"
        passwordHash:
            crypto
                .createHash("sha256")
                .update("another-synthetic-password")
                .digest("hex")
    }
];

const hashCredential = (credential) => {
    return crypto
        .createHash("sha256")
        .update(credential)
        .digest("hex");
};

const verifyCredential = (userId, credential) => {

    const user =
        syntheticUsers.find(
            (user) =>
                user.userId === userId
        );

    if (!user) {
        return false;
    }

    const suppliedHash =
        hashCredential(credential);

    return suppliedHash ===
        user.passwordHash;
};

module.exports = {
    verifyCredential
};