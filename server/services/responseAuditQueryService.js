const ResponseAction = require("../models/ResponseAction");

const getUserResponseActions = async (userId, status) => {

    const query = {
        userId
    };

    if (status) {
        query.status = status;
    }

    return await ResponseAction.find(query).sort({
        createdAt: -1
    });
};

module.exports = {
    getUserResponseActions
};