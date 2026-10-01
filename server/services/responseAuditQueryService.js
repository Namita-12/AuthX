const ResponseAction = require("../models/ResponseAction");

const getUserResponseActions = async (userId) => {
    return await ResponseAction.find({
        userId
    }).sort({
        createdAt: -1
    });
};

module.exports = {
    getUserResponseActions
};