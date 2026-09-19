const mongoose = require("mongoose");

const userTrustSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        trustScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            default: 70
        },

        trustLevel: {
            type: String,
            enum: [
                "TRUSTED",
                "NORMAL",
                "CAUTION",
                "LOW_TRUST",
                "UNTRUSTED"
            ],
            required: true,
            default: "NORMAL"
        },

        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "UserTrust",
    userTrustSchema
);