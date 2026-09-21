const crypto = require("crypto");

const Session = require("../models/Session");

const createSession = async ({
    userId,
    device,
    ipAddress,
    expiresAt
}) => {

    const sessionId = crypto.randomUUID();

    const session = await Session.create({
        userId,
        sessionId,
        device,
        ipAddress,
        expiresAt,
        revoked: false,
        revokedAt: null
    });

    return session;
};

const getSession = async (sessionId) => {

    const session = await Session.findOne({
        sessionId
    });

    return session;
};

const revokeSession = async (sessionId) => {

    const session = await Session.findOneAndUpdate(
        {
            sessionId,
            revoked: false
        },
        {
            revoked: true,
            revokedAt: new Date()
        },
        {
            new: true
        }
    );

    return session;
};

module.exports = {
    createSession,
    getSession,
    revokeSession
};