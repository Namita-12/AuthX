const mongoose = require("mongoose");

const securityIncidentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true
        },

        incidentType: {
            type: String,
            enum: [
                "POSSIBLE_ACCOUNT_TAKEOVER",
                "CREDENTIAL_ATTACK",
                "AUTHENTICATION_ANOMALY",
                "CREDENTIAL_EXPOSURE"
            ],
            required: true
        },

        severity: {
            type: String,
            enum: [
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL"
            ],
            required: true
        },

        riskScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },

        status: {
            type: String,
            enum: [
                "OPEN",
                "INVESTIGATING",
                "RESOLVED",
                "DISMISSED"
            ],
            default: "OPEN"
        },

        evidence: {
            type: [String],
            default: []
        },

        relatedEventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AuthEvent",
            required: true
        },

        detectedAt: {
            type: Date,
            default: Date.now
        },

        resolvedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "SecurityIncident",
    securityIncidentSchema
);