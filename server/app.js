const express = require("express");
const cors = require("cors");
const eventsRouter = require("./routes/events");
const app = express();
const authRouter = require("./routes/auth");
app.use(cors());
app.use(express.json());
app.use("/api/events", eventsRouter);
app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
    res.json({
        name: "AuthX",
        status: "online",
        message: "AuthX security platform is running."
    });
});

module.exports = app;