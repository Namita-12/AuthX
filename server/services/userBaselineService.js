const AuthEvent = require("../models/AuthEvent");

const getUserBaseline = async (userId) => {
    const trustedLogins = await AuthEvent.find({
        userId,
        eventType: "LOGIN_SUCCESS",
        riskLevel: "LOW"
    })
        .sort({ timestamp: -1 })
        .limit(50);

    const baseline = {
        totalSuccessfulLogins: trustedLogins.length,
        devices: [],
        cities: [],
        browsers: [],
        loginHours: []
    };

    for (const event of trustedLogins) {

        // Known devices
        if (
            event.device &&
            !baseline.devices.includes(event.device)
        ) {
            baseline.devices.push(event.device);
        }

        // Known cities
        if (
            event.location?.city &&
            !baseline.cities.includes(event.location.city)
        ) {
            baseline.cities.push(event.location.city);
        }

        // Known browsers
        if (
            event.browser &&
            !baseline.browsers.includes(event.browser)
        ) {
            baseline.browsers.push(event.browser);
        }

        // Convert UTC timestamp into user's local hour
        if (event.timestamp && event.timezone) {
            try {
                const formatter = new Intl.DateTimeFormat(
                    "en-US",
                    {
                        hour: "2-digit",
                        hour12: false,
                        timeZone: event.timezone
                    }
                );

                const parts = formatter.formatToParts(
                    new Date(event.timestamp)
                );

                const hourPart = parts.find(
                    (part) => part.type === "hour"
                );

                if (hourPart) {
                    let localHour = Number(hourPart.value);

                    // Some environments represent midnight as 24.
                    if (localHour === 24) {
                        localHour = 0;
                    }

                    baseline.loginHours.push(localHour);
                }
            } catch (error) {
                console.error(
                    `Invalid timezone "${event.timezone}":`,
                    error.message
                );
            }
        }
    }

    return baseline;
};

module.exports = {
    getUserBaseline
};