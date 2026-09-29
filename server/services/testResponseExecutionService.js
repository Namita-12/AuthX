require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});

const mongoose = require("mongoose");

const Session = require("../models/Session");
const ResponseAction = require("../models/ResponseAction");

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

    await ResponseAction.deleteMany({
        userId
    });

    // --------------------------------------------------
    // TEST 1: REVOKE_SESSIONS
    // --------------------------------------------------

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

    console.log(
        "\nCreated 2 active sessions"
    );

    const revokeResult =
        await executeResponseAction({
            action: "REVOKE_SESSIONS",
            userId
        });

    console.log(
        "\nREVOKE_SESSIONS result:"
    );

    console.log(revokeResult);

    // --------------------------------------------------
    // TEST 2: REQUIRE_CREDENTIAL_RESET
    // --------------------------------------------------

    const credentialResetResult =
        await executeResponseAction({
            action: "REQUIRE_CREDENTIAL_RESET",
            userId
        });

    console.log(
        "\nREQUIRE_CREDENTIAL_RESET result:"
    );

    console.log(credentialResetResult);

    // --------------------------------------------------
    // TEST 3: REQUIRE_ADDITIONAL_AUTHENTICATION
    // --------------------------------------------------

    const additionalAuthResult =
        await executeResponseAction({
            action:
                "REQUIRE_ADDITIONAL_AUTHENTICATION",
            userId
        });

    console.log(
        "\nREQUIRE_ADDITIONAL_AUTHENTICATION result:"
    );

    console.log(additionalAuthResult);

    // --------------------------------------------------
    // TEST 4: BLOCK_ACCOUNT_ACCESS
    // --------------------------------------------------

    const blockAccountResult =
        await executeResponseAction({
            action: "BLOCK_ACCOUNT_ACCESS",
            userId
        });

    console.log(
        "\nBLOCK_ACCOUNT_ACCESS result:"
    );

    console.log(blockAccountResult);

    // --------------------------------------------------
    // VERIFY AUDIT RECORDS
    // --------------------------------------------------

    const auditRecords =
        await ResponseAction.find({
            userId
        }).sort({
            createdAt: 1
        });

    console.log(
        "\nAudit records:"
    );

    auditRecords.forEach(
        (record) => {
            console.log({
                action: record.action,
                status: record.status,
                success: record.success,
                details: record.details
            });
        }
    );

    // --------------------------------------------------
    // VERIFY SESSION STATE
    // --------------------------------------------------

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

    // --------------------------------------------------
    // TEST 5: UNKNOWN ACTION
    // --------------------------------------------------

    const unknownResult =
        await executeResponseAction({
            action: "UNKNOWN_ACTION",
            userId
        });

    console.log(
        "\nUnknown action result:"
    );

    console.log(unknownResult);

    // --------------------------------------------------
    // CLEANUP
    // --------------------------------------------------

    await Session.deleteMany({
        userId
    });

    await ResponseAction.deleteMany({
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