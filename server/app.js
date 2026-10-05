const express = require("express");
const cors = require("cors");

const eventsRouter = require("./routes/events");
const authRouter = require("./routes/auth");
const incidentsRouter = require("./routes/incidents");
const responseActionsRouter =
    require("./routes/responseActions");
    const dashboardRouter =
    require("./routes/dashboard");
    const securityTimelineRouter =
    require("./routes/securityTimeline");
const credentialExposureRouter =
    require("./routes/credentialExposure");
const app = express();

app.use(cors());
app.use(express.json());
app.use(
    "/api/dashboard",
    dashboardRouter
);
app.use("/api/events", eventsRouter);
app.use("/api/auth", authRouter);
app.use("/api/incidents", incidentsRouter);
app.use(
    "/api/response-actions",
    responseActionsRouter
);
const evidenceRouter =
    require("./routes/evidence");

app.use("/api/evidence", evidenceRouter);
app.use(
    "/api/security-timeline",
    securityTimelineRouter
);
app.use(
    "/api/credential-exposure",
    credentialExposureRouter
);
app.get("/", (req, res) => {
    res.json({
        name: "AuthX",
        status: "online",
        message: "AuthX security platform is running."
    });
});

module.exports = app;