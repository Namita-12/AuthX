const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true
        },

        sessionId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        device: {
            type: String,
            trim: true
        },

        ipAddress: {
            type: String,
            trim: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        },

        expiresAt: {
            type: Date,
            required: true
        },

        revoked: {
            type: Boolean,
            default: false
        },

        revokedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Session", sessionSchema);