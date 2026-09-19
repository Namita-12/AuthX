require("dotenv").config({
    path: require("path").resolve(
        __dirname,
        "../../.env"
    )
});

const mongoose = require("mongoose");
const UserTrust = require("../models/UserTrust");

const runTest = async () => {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected successfully"
        );

        // Create or reset a test user's trust record
        const trust = await UserTrust.findOneAndUpdate(
            {
                userId: "trust_test_user"
            },
            {
                $set: {
                    trustScore: 70,
                    trustLevel: "NORMAL",
                    lastUpdated: new Date()
                }
            },
            {
                new: true,
                upsert: true
            }
        );

        console.log("\nCreated/updated trust:");
        console.log(trust);

        // Read it back from MongoDB
        const savedTrust =
            await UserTrust.findOne({
                userId: "trust_test_user"
            });

        console.log("\nRead from MongoDB:");
        console.log(savedTrust);

        // Update trust
        savedTrust.trustScore = 83;
        savedTrust.trustLevel = "TRUSTED";
        savedTrust.lastUpdated = new Date();

        await savedTrust.save();

        console.log("\nUpdated trust:");
        console.log(savedTrust);

        // Read final persisted value
        const finalTrust =
            await UserTrust.findOne({
                userId: "trust_test_user"
            });

        console.log("\nFinal persisted trust:");
        console.log(finalTrust);

    } catch (error) {

        console.error(
            "Trust persistence test failed:",
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