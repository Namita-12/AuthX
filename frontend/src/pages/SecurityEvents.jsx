import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getTimeline } from "../api";
import "./SecurityEvents.css";

const riskOrder = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
    INFO: 0
};

const getRiskClass = (risk) => {
    return String(risk || "INFO").toUpperCase();
};

const formatDate = (value) => {
    if (!value) return "Unknown";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString();
};

const getEventTitle = (item) => {
    return (
        item.eventType ||
        item.action ||
        item.type ||
        item.title ||
        "Security Activity"
    );
};

const getTimestamp = (item) => {
    return (
        item.timestamp ||
        item.createdAt ||
        item.detectedAt ||
        item.updatedAt
    );
};

const getRisk = (item) => {
    return String(
        item.riskLevel ||
        item.risk ||
        "INFO"
    ).toUpperCase();
};

const getLocation = (item) => {
    if (typeof item.location === "string") {
        return item.location;
    }

    if (item.location) {
        return [
            item.location.city,
            item.location.country
        ]
            .filter(Boolean)
            .join(", ");
    }

    return [
        item.city,
        item.country
    ]
        .filter(Boolean)
        .join(", ") || "Unknown";
};

function SecurityEvents() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [riskFilter, setRiskFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0
    });

    const loadEvents = async (pageNumber = 1) => {
        try {
            setLoading(true);
            setError("");

            const response = await getTimeline({
                page: pageNumber,
                limit: 20
            });

            const data = response.data;

            const timeline = Array.isArray(data.timeline)
                ? data.timeline
                : Array.isArray(data.timeline?.events)
                    ? data.timeline.events
                    : [];

            setEvents(timeline);

            setPagination(
                data.pagination || {
                    page: pageNumber,
                    pages: 1,
                    total: timeline.length
                }
            );

            setPage(pageNumber);
        } catch (err) {
            console.error(
                "Failed to load security events:",
                err
            );

            if (err.response?.status === 401) {
                localStorage.removeItem("authXToken");
                window.location.href = "/";
                return;
            }

            setError(
                err.response?.data?.message ||
                "Failed to load security events"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents(1);
    }, []);

    const filteredEvents = useMemo(() => {
        const query = search.trim().toLowerCase();

        return events
            .filter((event) => {
                if (riskFilter === "ALL") {
                    return true;
                }

                return getRisk(event) === riskFilter;
            })
            .filter((event) => {
                if (!query) {
                    return true;
                }

                const searchableText = [
                    getEventTitle(event),
                    getRisk(event),
                    getLocation(event),
                    event.ipAddress,
                    event.device,
                    event.browser,
                    ...(event.riskReasons || [])
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(query);
            });
    }, [events, riskFilter, search]);

    const stats = useMemo(() => {
        return {
            total: pagination.total || events.length,

            critical: events.filter(
                e => getRisk(e) === "CRITICAL"
            ).length,

            high: events.filter(
                e => getRisk(e) === "HIGH"
            ).length,

            medium: events.filter(
                e => getRisk(e) === "MEDIUM"
            ).length,

            low: events.filter(
                e => getRisk(e) === "LOW"
            ).length
        };
    }, [events, pagination.total]);

    return (
        <div className="events-page">

            <div className="events-header">
                <div>
                    <div className="events-kicker">
                        SECURITY OPERATIONS CENTER
                    </div>

                    <h1>
                        Security Events
                    </h1>
<Link
    to="/incidents"
    className="nav-item"
>
    <span>◆</span>
    Incidents
</Link>
                    <p>
                        Investigate authentication activity,
                        risk signals and security decisions.
                    </p>
                </div>

                <button
                    className="events-refresh"
                    onClick={() => loadEvents(page)}
                    disabled={loading}
                >
                    ↻ {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            <div className="event-stats">

                <div className="event-stat">
                    <span>Total Events</span>
                    <strong>{stats.total}</strong>
                </div>

                <div className="event-stat">
                    <span>Critical</span>
                    <strong className="critical-text">
                        {stats.critical}
                    </strong>
                </div>

                <div className="event-stat">
                    <span>High Risk</span>
                    <strong className="high-text">
                        {stats.high}
                    </strong>
                </div>

                <div className="event-stat">
                    <span>Medium Risk</span>
                    <strong className="medium-text">
                        {stats.medium}
                    </strong>
                </div>

                <div className="event-stat">
                    <span>Low Risk</span>
                    <strong className="low-text">
                        {stats.low}
                    </strong>
                </div>

            </div>

            <div className="events-toolbar">

                <div className="event-search">
                    <span>⌕</span>

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search IP, device, event, location..."
                    />
                </div>

                <div className="risk-filters">

                    {[
                        "ALL",
                        "CRITICAL",
                        "HIGH",
                        "MEDIUM",
                        "LOW"
                    ].map((risk) => (
                        <button
                            key={risk}
                            className={
                                riskFilter === risk
                                    ? "active"
                                    : ""
                            }
                            onClick={() => {
                                setRiskFilter(risk);
                            }}
                        >
                            {risk}
                        </button>
                    ))}

                </div>

            </div>

            {error && (
                <div className="events-error">
                    {error}
                </div>
            )}

            <div className="events-panel">

                <div className="events-panel-header">
                    <div>
                        <span className="panel-title">
                            EVENT STREAM
                        </span>

                        <span className="panel-count">
                            {filteredEvents.length} events
                        </span>
                    </div>

                    <span className="live-indicator">
                        <span />
                        LIVE DATA
                    </span>
                </div>

                {loading ? (
                    <div className="events-empty">
                        <div className="loading-ring" />
                        Loading security events...
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="events-empty">
                        <div className="empty-icon">
                            ◌
                        </div>

                        <strong>
                            No matching events
                        </strong>

                        <span>
                            Try changing the search or risk filter.
                        </span>
                    </div>
                ) : (
                    <div className="events-table-wrapper">

                        <table className="events-table">

                            <thead>
                                <tr>
                                    <th>EVENT</th>
                                    <th>RISK</th>
                                    <th>SCORE</th>
                                    <th>NETWORK</th>
                                    <th>CONTEXT</th>
                                    <th>TIME</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredEvents.map(
                                    (event, index) => {

                                        const risk =
                                            getRisk(event);

                                        return (
                                            <tr
                                                key={
                                                    event._id ||
                                                    event.id ||
                                                    `${getTimestamp(event)}-${index}`
                                                }
                                                onClick={() =>
                                                    setSelectedEvent(event)
                                                }
                                            >

                                                <td>
                                                    <div className="event-name">
                                                        <span
                                                            className={`event-dot ${risk.toLowerCase()}`}
                                                        />

                                                        <div>
                                                            <strong>
                                                                {getEventTitle(event)}
                                                            </strong>

                                                            <small>
                                                                {event.type ||
                                                                    "AUTHENTICATION"}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`risk-badge ${risk.toLowerCase()}`}
                                                    >
                                                        {risk}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="score">
                                                        {event.riskScore ??
                                                            "—"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="network-cell">
                                                        <strong>
                                                            {event.ipAddress ||
                                                                "Unknown IP"}
                                                        </strong>

                                                        <small>
                                                            {getLocation(event)}
                                                        </small>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="context-cell">
                                                        <strong>
                                                            {event.device ||
                                                                "Unknown device"}
                                                        </strong>

                                                        <small>
                                                            {event.browser ||
                                                                "Unknown browser"}
                                                        </small>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="event-time">
                                                        {formatDate(
                                                            getTimestamp(event)
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="view-event">
                                                        →
                                                    </span>
                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

                {!loading &&
                    pagination.pages > 1 && (
                        <div className="events-pagination">

                            <button
                                disabled={page <= 1}
                                onClick={() =>
                                    loadEvents(page - 1)
                                }
                            >
                                ← Previous
                            </button>

                            <span>
                                Page {page} of{" "}
                                {pagination.pages}
                            </span>

                            <button
                                disabled={
                                    page >= pagination.pages
                                }
                                onClick={() =>
                                    loadEvents(page + 1)
                                }
                            >
                                Next →
                            </button>

                        </div>
                    )}

            </div>

            {selectedEvent && (
                <div
                    className="event-overlay"
                    onClick={() =>
                        setSelectedEvent(null)
                    }
                >

                    <div
                        className="event-drawer"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="drawer-header">

                            <div>
                                <span className="events-kicker">
                                    EVENT INVESTIGATION
                                </span>

                                <h2>
                                    {getEventTitle(
                                        selectedEvent
                                    )}
                                </h2>
                            </div>

                            <button
                                className="drawer-close"
                                onClick={() =>
                                    setSelectedEvent(null)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="drawer-risk">

                            <span
                                className={`risk-badge ${getRisk(selectedEvent).toLowerCase()}`}
                            >
                                {getRisk(selectedEvent)}
                            </span>

                            <span>
                                Risk Score:{" "}
                                <strong>
                                    {selectedEvent.riskScore ??
                                        "—"}
                                </strong>
                            </span>

                        </div>

                        <div className="investigation-grid">

                            <div>
                                <label>EVENT TYPE</label>
                                <strong>
                                    {selectedEvent.eventType ||
                                        selectedEvent.type ||
                                        "Unknown"}
                                </strong>
                            </div>

                            <div>
                                <label>TIME</label>
                                <strong>
                                    {formatDate(
                                        getTimestamp(
                                            selectedEvent
                                        )
                                    )}
                                </strong>
                            </div>

                            <div>
                                <label>IP ADDRESS</label>
                                <strong>
                                    {selectedEvent.ipAddress ||
                                        "Unknown"}
                                </strong>
                            </div>

                            <div>
                                <label>LOCATION</label>
                                <strong>
                                    {getLocation(
                                        selectedEvent
                                    )}
                                </strong>
                            </div>

                            <div>
                                <label>DEVICE</label>
                                <strong>
                                    {selectedEvent.device ||
                                        "Unknown"}
                                </strong>
                            </div>

                            <div>
                                <label>BROWSER</label>
                                <strong>
                                    {selectedEvent.browser ||
                                        "Unknown"}
                                </strong>
                            </div>

                        </div>

                        <div className="investigation-section">

                            <div className="section-label">
                                RISK EXPLANATION
                            </div>

                            {selectedEvent.riskReasons?.length ? (
                                <div className="reason-list">
                                    {selectedEvent.riskReasons.map(
                                        (reason, index) => (
                                            <div
                                                key={index}
                                                className="reason-item"
                                            >
                                                <span>+</span>
                                                {reason}
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="no-reasons">
                                    No risk explanation
                                    recorded for this event.
                                </p>
                            )}

                        </div>

                        <div className="investigation-section">

                            <div className="section-label">
                                EVENT DATA
                            </div>

                            <pre className="event-json">
                                {JSON.stringify(
                                    selectedEvent,
                                    null,
                                    2
                                )}
                            </pre>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default SecurityEvents;