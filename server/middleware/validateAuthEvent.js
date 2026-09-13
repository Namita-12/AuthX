const Joi = require("joi");

const authEventSchema = Joi.object({
    userId: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required(),

    eventType: Joi.string()
        .valid(
            "LOGIN_SUCCESS",
            "LOGIN_FAILED",
            "LOGOUT"
        )
        .required(),

    ipAddress: Joi.string()
        .trim()
        .ip({
            version: ["ipv4", "ipv6"],
            cidr: "forbidden"
        })
        .required(),

    location: Joi.object({
        country: Joi.string()
            .trim()
            .max(100),

        city: Joi.string()
            .trim()
            .max(100)
    }).optional(),

    device: Joi.string()
        .trim()
        .min(1)
        .max(200)
        .required(),

    browser: Joi.string()
        .trim()
        .max(100)
        .optional(),
    timezone: Joi.string()
    .trim()
    .max(100)
    .optional()
});

const validateAuthEvent = (req, res, next) => {
    const { error, value } = authEventSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid authentication event",
            errors: error.details.map((detail) => detail.message)
        });
    }

    req.body = value;

    next();
};

module.exports = validateAuthEvent;