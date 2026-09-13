const AuthEvent = require("../models/AuthEvent");

const getUserBaseline = async (userId) => {
    const successfulLogins = await AuthEvent.find({
        userId,
        eventType: "LOGIN_SUCCESS"
    })
        .sort({ timestamp: -1 })
        .limit(50);

    const baseline = {
        totalSuccessfulLogins: successfulLogins.length,
        devices: [],
        cities: [],
        browsers: [],
        loginHours: []
    };

    for (const event of successfulLogins) {

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

        // Convert timestamp into user's local hour
        if (event.timestamp && event.timezone) {
            const localHour = Number(
                new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    hour12: false,
                    timeZone: event.timezone
                }).format(new Date(event.timestamp))
            );

            baseline.loginHours.push(localHour);
        }
    }

    return baseline;
};

module.exports = {
    getUserBaseline
};