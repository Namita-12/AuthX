const {
    decideAuthenticationAction
} = require("./authenticationDecisionEngine");

const riskLevels = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL"
];

console.log(
    "\n=== AUTHENTICATION DECISION TEST ==="
);

for (const riskLevel of riskLevels) {

    const decision =
        decideAuthenticationAction(
            riskLevel
        );

    console.log(
        `\n${riskLevel} RISK`
    );

    console.log(decision);
}