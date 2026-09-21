const mongoose = require("mongoose");

require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});

const {
    createSession,
    getSession,
    revokeSession
} = require("./sessionService");

const runTest = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const expiresAt = new Date(
            Date.now() + 60 * 60 * 1000
        );

        const session = await createSession({
            userId: "session_test_user",
            device: "Test Device",
            ipAddress: "127.0.0.1",
            expiresAt
        });

        console.log("\nCreated session:");
        console.log(session);

        const foundSession =
            await getSession(session.sessionId);

        console.log("\nRetrieved session:");
        console.log(foundSession);

        const revokedSession =
            await revokeSession(session.sessionId);

        console.log("\nRevoked session:");
        console.log(revokedSession);

        await mongoose.disconnect();

        console.log("\nSession service test completed");

    } catch (error) {

        console.error(
            "Session service test failed:",
            error.message
        );

        await mongoose.disconnect();

    }
};

runTest();