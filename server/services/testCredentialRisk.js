const {
    checkCredentialExposure,
    calculateCredentialRisk
} = require("./credentialRiskService");

console.log("\n=== EXPOSED CREDENTIAL ===");

const exposedResult = checkCredentialExposure(
    "example-password"
);

const exposedRisk = calculateCredentialRisk(
    exposedResult.exposed
);

console.log({
    exposure: exposedResult,
    risk: exposedRisk
});

console.log("\n=== UNKNOWN CREDENTIAL ===");

const safeResult = checkCredentialExposure(
    "another-synthetic-password"
);

const safeRisk = calculateCredentialRisk(
    safeResult.exposed
);

console.log({
    exposure: safeResult,
    risk: safeRisk
});