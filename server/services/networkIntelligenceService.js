const privateRanges = [
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2\d|3[0-1])\./
];

const suspiciousTestIps = new Set([
    "198.51.100.10",
    "203.0.113.50"
]);

const isPrivateIp = (ip) => {
    return privateRanges.some(
        (range) => range.test(ip)
    );
};

const getNetworkIntelligence = (ipAddress) => {
    if (!ipAddress) {
        return {
            ipAddress: null,
            classification: "UNKNOWN",
            riskScore: 0,
            reasons: ["IP address unavailable"]
        };
    }

    if (isPrivateIp(ipAddress)) {
        return {
            ipAddress,
            classification: "PRIVATE",
            riskScore: 0,
            reasons: [
                "IP belongs to a private network range"
            ]
        };
    }

    if (suspiciousTestIps.has(ipAddress)) {
        return {
            ipAddress,
            classification: "SUSPICIOUS",
            riskScore: 30,
            reasons: [
                "IP matches the configured suspicious test dataset"
            ]
        };
    }

    return {
        ipAddress,
        classification: "PUBLIC",
        riskScore: 0,
        reasons: [
            "No suspicious indicators found in local network intelligence"
        ]
    };
};

module.exports = {
    getNetworkIntelligence
};