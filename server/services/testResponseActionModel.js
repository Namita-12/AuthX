require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});

const mongoose = require("mongoose");
const ResponseAction = require("../models/ResponseAction");

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const responseAction = await ResponseAction.create({
            userId: "test_user",
            action: "REVOKE_SESSIONS",
            status: "EXECUTED",
            success: true,
            details: {
                revokedSessionCount: 3
            }
        });

        console.log("ResponseAction created:");
        console.log(responseAction);

        const found = await ResponseAction.findById(
            responseAction._id
        );

        console.log("ResponseAction found:");
        console.log(found);

        await ResponseAction.deleteOne({
            _id: responseAction._id
        });

        console.log("Test ResponseAction deleted");

        await mongoose.disconnect();

        console.log("Test completed successfully");

    } catch (error) {
        console.error("Test failed:", error.message);
        process.exit(1);
    }
};

test();