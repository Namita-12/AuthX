require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});

const mongoose = require("mongoose");
const AuthEvent = require("../models/AuthEvent");

const runCleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const result = await AuthEvent.deleteMany({
            userId: "user_001"
        });

        console.log(
            `Deleted ${result.deletedCount} authentication events`
        );

        await mongoose.disconnect();

        console.log("Cleanup complete");
    } catch (error) {
        console.error(
            "Cleanup failed:",
            error.message
        );
    }
};

runCleanup();