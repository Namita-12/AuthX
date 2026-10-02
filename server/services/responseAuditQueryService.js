const ResponseAction = require("../models/ResponseAction");

const getUserResponseActions = async (
    userId,
    status,
    action,
    page = 1,
    limit = 10
) => {
    const query = {
        userId
    };

    if (status) {
        query.status = status;
    }

    if (action) {
        query.action = action;
    }

    const skip = (page - 1) * limit;

    const [actions, total] = await Promise.all([
        ResponseAction.find(query)
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limit),

        ResponseAction.countDocuments(query)
    ]);

    return {
        actions,
        total
    };
};

module.exports = {
    getUserResponseActions
};