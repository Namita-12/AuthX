require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});

const mongoose = require("mongoose");

const Session = require("../models/Session");

const {
    createSession
} = require("./sessionService");

const {
    executeResponseAction
} = require("./responseExecutionService");

const test = async () => {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const userId =
        "response_execution_test_user";

    await Session.deleteMany({
        userId
    });

    // Create two active sessions
    await createSession({
        userId,
        device: "Test Laptop",
        ipAddress: "10.0.0.10",
        expiresAt:
            new Date(Date.now() + 60 * 60 * 1000)
    });

    await createSession({
        userId,
        device: "Test Phone",
        ipAddress: "10.0.0.11",
        expiresAt:
            new Date(Date.now() + 60 * 60 * 1000)
    });

    console.log("\nCreated 2 active sessions");

    const result =
        await executeResponseAction({
            action: "REVOKE_SESSIONS",
            userId
        });

    console.log(
        "\nResponse execution result:"
    );

    console.log(result);

    const sessions =
        await Session.find({
            userId
        });

    const activeSessions =
        sessions.filter(
            (session) => !session.revoked
        );

    const revokedSessions =
        sessions.filter(
            (session) => session.revoked
        );

    console.log(
        "\nActive sessions:",
        activeSessions.length
    );

    console.log(
        "Revoked sessions:",
        revokedSessions.length
    );

    // Test unknown action
    const unknown =
        await executeResponseAction({
            action: "UNKNOWN_ACTION",
            userId
        });

    console.log(
        "\nUnknown action result:"
    );

    console.log(unknown);

    await Session.deleteMany({
        userId
    });

    console.log(
        "\nTest data cleaned"
    );

    await mongoose.disconnect();

    console.log(
        "Test completed"
    );
};

test().catch(async (error) => {

    console.error(
        "Test failed:",
        error
    );

    await mongoose.disconnect();

    process.exit(1);
});