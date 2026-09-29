const { revokeAllUserSessions } =
    require("./sessionService");

const {
    recordResponseAction
} = require("./responseAuditService");

const executeResponseAction = async ({
    action,
    userId
}) => {

    switch (action) {

        case "REVOKE_SESSIONS": {

            const result =
                await revokeAllUserSessions(userId);

            const response = {
                action,
                status: "EXECUTED",
                success: true,
                details: {
                    revokedSessionCount:
                        result.revokedCount
                }
            };

            await recordResponseAction({
                userId,
                action: response.action,
                status: response.status,
                success: response.success,
                details: response.details
            });

            return response;
        }

        case "REQUIRE_CREDENTIAL_RESET": {

            const response = {
                action,
                status: "RECOMMENDED",
                success: false,
                details: {
                    message:
                        "Credential reset capability is not implemented yet"
                }
            };

            await recordResponseAction({
                userId,
                action: response.action,
                status: response.status,
                success: response.success,
                details: response.details
            });

            return response;
        }

        case "REQUIRE_ADDITIONAL_AUTHENTICATION": {

            const response = {
                action,
                status: "RECOMMENDED",
                success: false,
                details: {
                    message:
                        "Additional authentication capability is not implemented yet"
                }
            };

            await recordResponseAction({
                userId,
                action: response.action,
                status: response.status,
                success: response.success,
                details: response.details
            });

            return response;
        }

        case "BLOCK_ACCOUNT_ACCESS": {

            const response = {
                action,
                status: "RECOMMENDED",
                success: false,
                details: {
                    message:
                        "Account access blocking capability is not implemented yet"
                }
            };

            await recordResponseAction({
                userId,
                action: response.action,
                status: response.status,
                success: response.success,
                details: response.details
            });

            return response;
        }

        default: {

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
    }
};

module.exports = {
    executeResponseAction
};