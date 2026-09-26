const {
    generateResponseActions
} = require("../risk-engine/responseEngine");

const {
    executeResponseAction
} = require("./responseExecutionService");

const executeSecurityResponse = async ({
    userId,
    riskLevel,
    accountTakeoverDetected,
    credentialRiskLevel
}) => {

    const actions =
        generateResponseActions({
            riskLevel,
            accountTakeoverDetected,
            credentialRiskLevel
        });

    const results = [];

    for (const action of actions) {

        const result =
            await executeResponseAction({
                action,
                userId
            });

        results.push(result);
    }

    return {
        actions,
        results
    };
};

module.exports = {
    executeSecurityResponse
};