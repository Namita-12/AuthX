const {
    revokeAllUserSessions
} = require("./sessionService");

const executeResponseAction = async ({
    action,
    userId
}) => {

    switch (action) {

        case "REVOKE_SESSIONS": {

            const result =
                await revokeAllUserSessions(userId);

            return {
                action,
                status: "EXECUTED",
                success: true,
                details: {
                    revokedSessionCount:
                        result.revokedCount
                }
            };
        }

        case "REQUIRE_CREDENTIAL_RESET":

            return {
                action,
                status: "RECOMMENDED",
                success: false,
                details: {
                    message:
                        "Credential reset capability is not implemented yet"
                }
            };

        case "REQUIRE_ADDITIONAL_AUTHENTICATION":

            return {
                action,
                status: "RECOMMENDED",
                success: false,
                details: {
                    message:
                        "Additional authentication capability is not implemented yet"
                }
            };

        case "BLOCK_ACCOUNT_ACCESS":

            return {
                action,
                status: "RECOMMENDED",
                success: false,
                details: {
                    message:
                        "Account access blocking capability is not implemented yet"
                }
            };

        default:

            return {
                action,
                status: "UNSUPPORTED",
                success: false,
                details: {
                    message:
                        "Unknown response action"
                }
            };
    }
};

module.exports = {
    executeResponseAction
};