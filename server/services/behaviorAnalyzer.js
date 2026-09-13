const analyzeBehavior = (event, baseline) => {
    const signals = [];
    let score = 0;

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
        const currentHour = Number(
            new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                hour12: false,
                timeZone: event.timezone
            }).format(new Date(event.timestamp))
        );

        const isNormalTime = baseline.loginHours.some(
            (hour) => Math.abs(hour - currentHour) <= 2
        );

        if (!isNormalTime) {
            score += 20;
            signals.push("Unusual login time");
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
        signals
    };
};

module.exports = {
    analyzeBehavior
};