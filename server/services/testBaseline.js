require("dotenv").config();

const mongoose = require("mongoose");
const { getUserBaseline } = require("./userBaselineService");

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const baseline = await getUserBaseline("user_001");

        console.log("\nAuthX User Baseline");
        console.log("-------------------");
        console.log("Successful logins:", baseline.totalSuccessfulLogins);
        console.log("Devices:", baseline.devices);
        console.log("Cities:", baseline.cities);
        console.log("Browsers:", baseline.browsers);
        console.log("Login hours:", baseline.loginHours);

        await mongoose.disconnect();
    } catch (error) {
        console.error("Baseline test failed:", error.message);
    }
};

runTest();