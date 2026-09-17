const calculateCircularHourDistance = (hour1, hour2) => {
    const difference = Math.abs(hour1 - hour2);

    return Math.min(
        difference,
        24 - difference
    );
};

const analyzeBehavior = (event, baseline) => {
   const signals = [];
let score = 0;

let isNewDevice = false;
let isNewLocation = false;
    // 1. BASELINE CONFIDENCE

    let confidence;

    if (baseline.totalSuccessfulLogins >= 10) {
        confidence = "HIGH";
    } else if (baseline.totalSuccessfulLogins >= 3) {
        confidence = "MEDIUM";
    } else {
        confidence = "LOW";
    }

    // 2. DEVICE ANALYSIS

    const knownDevice =
        baseline.devices.includes(event.device);

  if (
    !knownDevice &&
    baseline.totalSuccessfulLogins > 0
) {
    score += 25;

    isNewDevice = true;

    signals.push("New device detected");
}

    // 3. LOCATION ANALYSIS

    const currentCity = event.location?.city;

    const knownLocation =
        currentCity &&
        baseline.cities.includes(currentCity);
if (
    currentCity &&
    !knownLocation &&
    baseline.totalSuccessfulLogins > 0
) {
    score += 25;

    isNewLocation = true;

    signals.push("New location detected");
}

    // 4. BROWSER ANALYSIS

    const knownBrowser =
        baseline.browsers.includes(event.browser);

    if (
        event.browser &&
        !knownBrowser &&
        baseline.totalSuccessfulLogins > 0
    ) {
        score += 15;
        signals.push("New browser detected");
    }

    // 5. LOGIN TIME ANALYSIS

    if (
        event.timestamp &&
        event.timezone &&
        baseline.loginHours.length >= 3
    ) {
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
                let currentHour =
                    Number(hourPart.value);

                if (currentHour === 24) {
                    currentHour = 0;
                }

                const isNormalTime =
                    baseline.loginHours.some(
                        (hour) =>
                            calculateCircularHourDistance(
                                hour,
                                currentHour
                            ) <= 2
                    );

                if (!isNormalTime) {
                    score += 20;
                    signals.push(
                        "Unusual login time"
                    );
                }
            }
        } catch (error) {
            console.error(
                `Invalid timezone "${event.timezone}":`,
                error.message
            );
        }
    }

    // 6. FINAL STATUS

    score = Math.min(score, 100);

    let status;

    if (score >= 60) {
        status = "ANOMALOUS";
    } else if (score >= 30) {
        status = "SUSPICIOUS";
    } else {
        status = "NORMAL";
    }

    return {
    score,
    status,
    confidence,
    signals,

    isNewDevice,
    isNewLocation
};
};

module.exports = {
    analyzeBehavior
};