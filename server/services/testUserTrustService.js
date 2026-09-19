require("dotenv").config({
    path: require("path").resolve(
        __dirname,
        "../../.env"
    )
});

const mongoose = require("mongoose");

const {
    getUserTrust,
    updateUserTrust
} = require("./userTrustService");


const runTest = async () => {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected successfully"
        );


        // --------------------------------
        // Reset test user
        // --------------------------------

        const UserTrust =
            require("../models/UserTrust");

        await UserTrust.deleteOne({
            userId: "adaptive_test_user"
        });


        // --------------------------------
        // First trust lookup
        // --------------------------------

        const initialTrust =
            await getUserTrust(
                "adaptive_test_user"
            );

        console.log(
            "\nInitial trust:"
        );

        console.log({
            score: initialTrust.trustScore,
            level: initialTrust.trustLevel
        });


        // --------------------------------
        // Normal login
        // --------------------------------

        const normalLogin =
            await updateUserTrust({

                userId:
                    "adaptive_test_user",

                eventType:
                    "LOGIN_SUCCESS",

                behaviorScore:
                    10,

                isNewDevice:
                    false,

                isNewLocation:
                    false,

                recentFailedAttempts:
                    0,

                credentialRiskLevel:
                    "LOW",

                accountTakeoverDetected:
                    false

            });

        console.log(
            "\nAfter normal login:"
        );

        console.log({
            score: normalLogin.trustScore,
            level: normalLogin.trustLevel
        });


        // --------------------------------
        // Suspicious login
        // --------------------------------

        const suspiciousLogin =
            await updateUserTrust({

                userId:
                    "adaptive_test_user",

                eventType:
                    "LOGIN_SUCCESS",

                behaviorScore:
                    75,

                isNewDevice:
                    true,

                isNewLocation:
                    true,

                recentFailedAttempts:
                    0,

                credentialRiskLevel:
                    "LOW",

                accountTakeoverDetected:
                    false

            });

        console.log(
            "\nAfter suspicious login:"
        );

        console.log({
            score: suspiciousLogin.trustScore,
            level: suspiciousLogin.trustLevel
        });


        // --------------------------------
        // ATO scenario
        // --------------------------------

        const takeover =
            await updateUserTrust({

                userId:
                    "adaptive_test_user",

                eventType:
                    "LOGIN_SUCCESS",

                behaviorScore:
                    85,

                isNewDevice:
                    true,

                isNewLocation:
                    true,

                recentFailedAttempts:
                    5,

                credentialRiskLevel:
                    "HIGH",

                accountTakeoverDetected:
                    true

            });

        console.log(
            "\nAfter account takeover:"
        );

        console.log({
            score: takeover.trustScore,
            level: takeover.trustLevel
        });


    } catch (error) {

        console.error(
            "Trust service test failed:",
            error.message
        );

    } finally {

        await mongoose.disconnect();

        console.log(
            "\nMongoDB connection closed"
        );
    }
};


runTest();