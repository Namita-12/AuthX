require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});

const mongoose = require("mongoose");

const Session = require("../models/Session");

const {
    createSession,
    revokeAllUserSessions
} = require("./sessionService");

const test = async () => {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const userId = "revoke_all_test_user";

    // Clean previous test data
    await Session.deleteMany({
        userId
    });

    // Create three active sessions
    await createSession({
        userId,
        device: "Test Laptop",
        ipAddress: "10.0.0.1",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    });

    await createSession({
        userId,
        device: "Test Phone",
        ipAddress: "10.0.0.2",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    });

    await createSession({
        userId,
        device: "Test Tablet",
        ipAddress: "10.0.0.3",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    });

    console.log("\nCreated 3 active sessions");

    const before =
        await Session.find({
            userId
        });

    console.log(
        "Active before:",
        before.filter(
            (session) => !session.revoked
        ).length
    );

    // Revoke every active session
    const result =
        await revokeAllUserSessions(userId);

    console.log(
        "Revoked count:",
        result.revokedCount
    );

    const after =
        await Session.find({
            userId
        });

    console.log(
        "Active after:",
        after.filter(
            (session) => !session.revoked
        ).length
    );

    console.log(
        "Revoked after:",
        after.filter(
            (session) => session.revoked
        ).length
    );

    // Cleanup
    await Session.deleteMany({
        userId
    });

    console.log("\nTest data cleaned");

    await mongoose.disconnect();

    console.log("Test completed");
};

test().catch(async (error) => {

    console.error(
        "Test failed:",
        error
    );

    await mongoose.disconnect();

    process.exit(1);
});