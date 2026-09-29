const ResponseAction = require("../models/ResponseAction");

const recordResponseAction = async ({
    userId,
    action,
    status,
    success,
    details
}) => {
    const responseAction = await ResponseAction.create({
        userId,
        action,
        status,
        success,
        details
    });

    return responseAction;
};

module.exports = {
    recordResponseAction
};