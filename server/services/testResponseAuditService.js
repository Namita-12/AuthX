require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});

const mongoose = require("mongoose");
const { recordResponseAction } = require("./responseAuditService");
const ResponseAction = require("../models/ResponseAction");

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const responseAction = await recordResponseAction({
            userId: "test_user",
            action: "REVOKE_SESSIONS",
            status: "EXECUTED",
            success: true,
            details: {
                revokedSessionCount: 2
            }
        });

        console.log("Response action recorded:");
        console.log(responseAction);

        const found = await ResponseAction.findById(
            responseAction._id
        );

        console.log("Response action retrieved:");
        console.log(found);

        await ResponseAction.deleteOne({
            _id: responseAction._id
        });

        console.log("Test response action deleted");

        await mongoose.disconnect();

        console.log("Audit service test completed successfully");

    } catch (error) {
        console.error("Audit service test failed:", error.message);
        process.exit(1);
    }
};

test();