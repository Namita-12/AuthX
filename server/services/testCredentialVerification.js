const {
    verifyCredential
} = require("./credentialVerificationService");

console.log("\n=== CREDENTIAL VERIFICATION TEST ===");

const correctCredential =
    verifyCredential(
        "user_001",
        "example-password"
    );

console.log(
    "Correct credential:",
    correctCredential
);

const incorrectCredential =
    verifyCredential(
        "user_001",
        "wrong-password"
    );

console.log(
    "Incorrect credential:",
    incorrectCredential
);

const unknownUser =
    verifyCredential(
        "unknown_user",
        "example-password"
    );

console.log(
    "Unknown user:",
    unknownUser
);