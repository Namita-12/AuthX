const mongoose = require("mongoose");

const responseActionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true
        },

        action: {
            type: String,
            enum: [
                "REVOKE_SESSIONS",
                "REQUIRE_CREDENTIAL_RESET",
                "REQUIRE_ADDITIONAL_AUTHENTICATION",
                "BLOCK_ACCOUNT_ACCESS"
            ],
            required: true
        },

        status: {
            type: String,
            enum: [
                "EXECUTED",
                "RECOMMENDED",
                "UNSUPPORTED"
            ],
            required: true
        },

        success: {
            type: Boolean,
            required: true
        },

        details: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        executedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "ResponseAction",
    responseActionSchema
);