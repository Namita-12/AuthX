const express = require("express");
const jwt = require("jsonwebtoken");

const {
    authenticateUser
} = require("../services/authenticationService");

const router = express.Router();

router.post("/login", (req, res) => {
    const {
        userId,
        credential
    } = req.body;

    // 1. Validate required fields
    if (!userId || !credential) {
        return res.status(400).json({
            success: false,
            message:
                "userId and credential are required"
        });
    }

    // 2. Authenticate user
    const authentication =
        authenticateUser(
            userId,
            credential
        );

    // 3. Reject invalid credentials
    if (!authentication.authenticated) {
        return res.status(401).json({
            success: false,
            message:
                "Invalid credentials"
        });
    }

    // 4. Create JWT after successful authentication
    const token = jwt.sign(
        {
            userId: userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    // 5. Return authentication + credential risk
    res.json({
        success: true,

        message:
            "Authentication successful",

        accessToken: token,

        credentialRisk:
            authentication.credentialRisk
    });
});

module.exports = router;