const mongoose = require("mongoose");

const authEventSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true
        },

        eventType: {
            type: String,
            enum: [
    "LOGIN_SUCCESS",
    "LOGIN_FAILED",
    "LOGIN_CHALLENGE_REQUIRED",
    "LOGIN_BLOCKED",
    "LOGOUT"
],
            required: true
        },

        ipAddress: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            country: {
                type: String,
                trim: true
            },
            city: {
                type: String,
                trim: true
            }
        },

        device: {
            type: String,
            required: true,
            trim: true
        },

        browser: {
            type: String,
            trim: true
        },
timezone: {
    type: String,
    trim: true
},
        timestamp: {
            type: Date,
            default: Date.now
        },

        // AuthX risk analysis
        riskScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        riskLevel: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    default: "LOW"
},

        riskReasons: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("AuthEvent", authEventSchema);