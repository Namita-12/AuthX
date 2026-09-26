require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});

const mongoose = require("mongoose");

const Session = require("../models/Session");

const {
    createSession
} = require("./sessionService");

const {
    executeSecurityResponse
} = require("./responseOrchestrator");

const test = async () => {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const userId =
        "response_orchestrator_test_user";

    await Session.deleteMany({
        userId
    });

    await createSession({
        userId,
        device: "Test Laptop",
        ipAddress: "10.0.0.20",
        expiresAt:
            new Date(Date.now() + 60 * 60 * 1000)
    });

    await createSession({
        userId,
        device: "Test Phone",
        ipAddress: "10.0.0.21",
        expiresAt:
            new Date(Date.now() + 60 * 60 * 1000)
    });

    console.log("\nCreated 2 active sessions");

    const response =
        await executeSecurityResponse({
            userId,
            riskLevel: "CRITICAL",
            accountTakeoverDetected: true,
            credentialRiskLevel: "HIGH"
        });

    console.log(
        "\nResponse actions:"
    );

    console.log(response.actions);

    console.log(
        "\nExecution results:"
    );

    console.dir(
        response.results,
        { depth: null }
    );

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