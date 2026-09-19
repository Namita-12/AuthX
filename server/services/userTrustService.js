const UserTrust = require("../models/UserTrust");

const {
    calculateTrustScore
} = require("../risk-engine/trustScoreEngine");


// --------------------------------
// Get current trust for a user
// --------------------------------

const getUserTrust = async (userId) => {

    let trust = await UserTrust.findOne({
        userId
    });

    // Create a default trust record
    // if this is the user's first evaluation
    if (!trust) {

        trust = await UserTrust.create({
            userId,
            trustScore: 70,
            trustLevel: "NORMAL",
            lastUpdated: new Date()
        });
    }

    return trust;
};


// --------------------------------
// Update user's adaptive trust
// --------------------------------

const updateUserTrust = async ({
    userId,
    eventType,
    behaviorScore = 0,
    isNewDevice = false,
    isNewLocation = false,
    recentFailedAttempts = 0,
    credentialRiskLevel = "LOW",
    accountTakeoverDetected = false
}) => {

    // Get the user's current trust
    const currentTrust =
        await getUserTrust(userId);

    // Calculate the new trust score
    const newTrust =
        calculateTrustScore({

            previousTrust:
                currentTrust.trustScore,

            eventType,

            behaviorScore,

            isNewDevice,

            isNewLocation,

            recentFailedAttempts,

            credentialRiskLevel,

            accountTakeoverDetected

        });

    // Persist the new trust state
    currentTrust.trustScore =
        newTrust.score;

    currentTrust.trustLevel =
        newTrust.level;

    currentTrust.lastUpdated =
        new Date();

    await currentTrust.save();

    return currentTrust;
};


module.exports = {
    getUserTrust,
    updateUserTrust
};