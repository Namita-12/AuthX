const decideAuthenticationAction = (riskLevel) => {

    switch (riskLevel) {

        case "LOW":
            return {
                action: "ALLOW",
                requiresAdditionalAuthentication: false,
                message:
                    "Authentication can proceed normally"
            };

        case "MEDIUM":
            return {
                action: "REQUIRE_ADDITIONAL_AUTHENTICATION",
                requiresAdditionalAuthentication: true,
                message:
                    "Additional authentication is recommended"
            };

        case "HIGH":
            return {
                action: "REQUIRE_ADDITIONAL_AUTHENTICATION",
                requiresAdditionalAuthentication: true,
                message:
                    "Stronger authentication is required"
            };

        case "CRITICAL":
            return {
                action: "BLOCK",
                requiresAdditionalAuthentication: true,
                message:
                    "Authentication should be blocked pending security review"
            };

        default:
            return {
                action: "BLOCK",
                requiresAdditionalAuthentication: true,
                message:
                    "Unknown risk level"
            };
    }
};

module.exports = {
    decideAuthenticationAction
};