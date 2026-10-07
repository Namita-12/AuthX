import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    getTimeline,
    getEvidence
} from "../api";

import "./SecurityEvents.css";

const SecurityEvents = () => {
    const [events, setEvents] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 1
    });

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [riskFilter, setRiskFilter] =
        useState("ALL");

    const [selectedEvent, setSelectedEvent] =
        useState(null);

    const [evidence, setEvidence] =
        useState(null);

    const [evidenceLoading, setEvidenceLoading] =
        useState(false);

    const [evidenceError, setEvidenceError] =
        useState("");

    const getEventData = (event) => {
        return event?.data || event || {};
    };

    const getEventId = (event) => {
        const data = getEventData(event);

        return (
            data?._id ||
            data?.id ||
            data?.eventId ||
            event?._id ||
            event?.id ||
            event?.eventId ||
            null
        );
    };

    const getTimestamp = (event) => {
        return (
            event?.timestamp ||
            event?.data?.timestamp ||
            event?.createdAt ||
            event?.data?.createdAt ||
            null
        );
    };

    const getEventTitle = (event) => {
        const data = getEventData(event);

        return (
            data?.eventType ||
            data?.type ||
            event?.type ||
            "AUTHENTICATION EVENT"
        )
            .replaceAll("_", " ");
    };

    const getRisk = (event) => {
        const data = getEventData(event);

        return (
            data?.riskLevel ||
            event?.riskLevel ||
            "LOW"
        ).toUpperCase();
    };

    const getRiskScore = (event) => {
        const data = getEventData(event);

        return (
            data?.riskScore ??
            event?.riskScore ??
            0
        );
    };

    const getRiskReasons = (event) => {
        const data = getEventData(event);

        return (
            data?.riskReasons ||
            data?.risk?.reasons ||
            event?.riskReasons ||
            []
        );
    };

    const getDecision = (event) => {
        const data = getEventData(event);

        return (
            data?.securityDecision ||
            data?.decision ||
            event?.securityDecision ||
            event?.decision ||
            "ALLOW"
        );
    };

    const getLocation = (event) => {
        const data = getEventData(event);

        const location =
            data?.location ||
            event?.location;

        if (!location) {
            return "Unknown";
        }

        if (typeof location === "string") {
            return location;
        }

        if (typeof location === "object") {
            return (
                location.city ||
                location.country ||
                location.name ||
                "Unknown"
            );
        }

        return "Unknown";
    };

    const formatDate = (value) => {
        if (!value) {
            return "Unknown time";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Unknown time";
        }

        return date.toLocaleString();
    };

    const loadEvents = async (
        requestedPage = 1
    ) => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getTimeline({
                    page: requestedPage,
                    limit: 20
                });

            const data = response.data;

            setEvents(
                data?.timeline ||
                data?.events ||
                []
            );

            setPagination(
                data?.pagination || {
                    page: requestedPage,
                    limit: 20,
                    total: 0,
                    pages: 1
                }
            );

            setPage(requestedPage);

        } catch (err) {
            console.error(
                "Failed to load security events:",
                err
            );

            if (
                err.response?.status === 401
            ) {
                localStorage.removeItem(
                    "authXToken"
                );

                window.location.href =
                    "/login";

                return;
            }

            setError(
                err.response?.data?.message ||
                "Failed to load security events."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents(1);
    }, []);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const data =
                getEventData(event);

            const risk =
                getRisk(event);

            if (
                riskFilter !== "ALL" &&
                risk !== riskFilter
            ) {
                return false;
            }

            if (!search.trim()) {
                return true;
            }

            const searchText =
                [
                    data?.eventType,
                    data?.ipAddress,
                    data?.device,
                    data?.browser,
                    data?.country,
                    data?.city,
                    getLocation(event),
                    risk
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

            return searchText.includes(
                search.toLowerCase()
            );
        });
    }, [
        events,
        search,
        riskFilter
    ]);

    const stats = useMemo(() => {
        return {
            total:
                pagination.total ||
                events.length,

            critical:
                events.filter(
                    event =>
                        getRisk(event) ===
                        "CRITICAL"
                ).length,

            high:
                events.filter(
                    event =>
                        getRisk(event) ===
                        "HIGH"
                ).length,

            medium:
                events.filter(
                    event =>
                        getRisk(event) ===
                        "MEDIUM"
                ).length,

            low:
                events.filter(
                    event =>
                        getRisk(event) ===
                        "LOW"
                ).length
        };
    }, [
        events,
        pagination.total
    ]);

    const openInvestigation = async (
        event
    ) => {
        setSelectedEvent(event);
        setEvidence(null);
        setEvidenceError("");

        const eventId =
            getEventId(event);

        if (!eventId) {
            setEvidenceError(
                "This event does not have a valid event ID."
            );

            return;
        }

        try {
            setEvidenceLoading(true);

            const response =
                await getEvidence(eventId);

            setEvidence(
                response.data?.evidence ||
                null
            );

        } catch (err) {
            console.error(
                "Failed to load event evidence:",
                err
            );

            if (
                err.response?.status === 401
            ) {
                localStorage.removeItem(
                    "authXToken"
                );

                window.location.href =
                    "/login";

                return;
            }

            setEvidenceError(
                err.response?.data?.message ||
                "Evidence could not be loaded."
            );

        } finally {
            setEvidenceLoading(false);
        }
    };

    const closeInvestigation = () => {
        setSelectedEvent(null);
        setEvidence(null);
        setEvidenceError("");
    };

    const selectedData =
        evidence?.event ||
        getEventData(selectedEvent);

    const selectedRisk =
        evidence?.risk?.level ||
        getRisk(selectedEvent);

    const selectedScore =
        evidence?.risk?.score ??
        getRiskScore(selectedEvent);

    const selectedReasons =
        evidence?.risk?.reasons ||
        getRiskReasons(selectedEvent);

    const selectedDecision =
        getDecision(selectedEvent);

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

                    <p>
                        Investigate authentication
                        activity and understand
                        why AuthX assigned each
                        security decision.
                    </p>

                </div>

                <div className="events-header-actions">

                    <Link
                        to="/incidents"
                        className="events-incidents-link"
                    >
                        View Incidents
                    </Link>

                    <button
                        className="events-refresh"
                        onClick={() =>
                            loadEvents(page)
                        }
                        disabled={loading}
                    >
                        ↻{" "}
                        {loading
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                </div>

            </div>

            <div className="event-stats">

                <div className="event-stat">
                    <span>
                        Total Events
                    </span>

                    <strong>
                        {stats.total}
                    </strong>
                </div>

                <div className="event-stat">
                    <span>
                        Critical
                    </span>

                    <strong className="critical-text">
                        {stats.critical}
                    </strong>
                </div>

                <div className="event-stat">
                    <span>
                        High Risk
                    </span>

                    <strong className="high-text">
                        {stats.high}
                    </strong>
                </div>

                <div className="event-stat">
                    <span>
                        Medium Risk
                    </span>

                    <strong className="medium-text">
                        {stats.medium}
                    </strong>
                </div>

                <div className="event-stat">
                    <span>
                        Low Risk
                    </span>

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
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
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
                                riskFilter ===
                                risk
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setRiskFilter(
                                    risk
                                )
                            }
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
                            EVENTSTREAM
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
                            Try changing the
                            search or risk filter.
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
                                    <th />
                                </tr>

                            </thead>

                            <tbody>

                                {filteredEvents.map(
                                    (
                                        event,
                                        index
                                    ) => {

                                        const risk =
                                            getRisk(
                                                event
                                            );

                                        const data =
                                            getEventData(
                                                event
                                            );

                                        return (
                                            <tr
    key={
        getEventId(event) ||
        `${getTimestamp(event)}-${index}`
    }
    onClick={() => {
        console.log("EVENT CLICKED");
        console.log("EVENT:", event);
        openInvestigation(event);
    }}
    style={{ cursor: "pointer" }}
>

                                                <td>

                                                    <div className="event-name">

                                                        <span
                                                            className={`event-dot ${risk.toLowerCase()}`}
                                                        />

                                                        <div>

                                                            <strong>
                                                                {getEventTitle(
                                                                    event
                                                                )}
                                                            </strong>

                                                            <small>
                                                                {event.type ||
                                                                    "AUTH EVENT"}
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
                                                        {getRiskScore(
                                                            event
                                                        )}
                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="network-cell">

                                                        <strong>
                                                            {data.ipAddress ||
                                                                "Unknown IP"}
                                                        </strong>

                                                        <small>
                                                            {getLocation(
                                                                event
                                                            )}
                                                        </small>

                                                    </div>

                                                </td>

                                                <td>

                                                    <div className="context-cell">

                                                        <strong>
                                                            {data.device ||
                                                                "Unknown device"}
                                                        </strong>

                                                        <small>
                                                            {data.browser ||
                                                                "Unknown browser"}
                                                        </small>

                                                    </div>

                                                </td>

                                                <td>

                                                    <span className="event-time">
                                                        {formatDate(
                                                            getTimestamp(
                                                                event
                                                            )
                                                        )}
                                                    </span>

                                                </td>

                                                <td>
    <button
        type="button"
        className="view-event"
        onClick={(clickEvent) => {
            clickEvent.stopPropagation();
            console.log("INVESTIGATE BUTTON CLICKED");
            console.log("EVENT:", event);
            openInvestigation(event);
        }}
    >
        →
    </button>
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
                                disabled={
                                    page <= 1
                                }
                                onClick={() =>
                                    loadEvents(
                                        page - 1
                                    )
                                }
                            >
                                ← Previous
                            </button>

                            <span>
                                Page{" "}
                                <strong>
                                    {pagination.page ||
                                        page}
                                </strong>{" "}
                                of{" "}
                                <strong>
                                    {pagination.pages}
                                </strong>
                            </span>

                            <button
                                disabled={
                                    page >=
                                    pagination.pages
                                }
                                onClick={() =>
                                    loadEvents(
                                        page + 1
                                    )
                                }
                            >
                                Next →
                            </button>

                        </div>
                    )}

            </div>

            {selectedEvent && (
                <div
                    className="investigation-overlay"
                    onClick={
                        closeInvestigation
                    }
                >

                    <aside
                        className="investigation-drawer"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="investigation-header">

                            <div>

                                <span className="investigation-kicker">
                                    EVENT INVESTIGATION
                                </span>

                                <h2>
                                    {getEventTitle(
                                        evidence?.event ||
                                        selectedEvent
                                    )}
                                </h2>

                                <span className="investigation-time">
                                    {formatDate(
                                        getTimestamp(
                                            evidence?.event ||
                                            selectedEvent
                                        )
                                    )}
                                </span>

                            </div>

                            <button
                                className="investigation-close"
                                onClick={
                                    closeInvestigation
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="investigation-risk-hero">

                            <div>

                                <span>
                                    RISK SCORE
                                </span>

                                <strong>
                                    {selectedScore}
                                    <small>
                                        / 100
                                    </small>
                                </strong>

                            </div>

                            <span
                                className={`investigation-risk-badge ${selectedRisk.toLowerCase()}`}
                            >
                                {selectedRisk}
                            </span>

                        </div>

                        {evidenceLoading && (
                            <div className="investigation-section">

                                <div className="evidence-loading">
                                    Loading security evidence...
                                </div>

                            </div>
                        )}

                        {evidenceError && (
                            <div className="investigation-section">

                                <div className="evidence-error">
                                    {evidenceError}
                                </div>

                            </div>
                        )}

                        <div className="investigation-section">

                            <div className="section-label">
                                RISK SIGNALS
                            </div>

                            {selectedReasons?.length >
                            0 ? (
                                <div className="reason-list">

                                    {selectedReasons.map(
                                        (
                                            reason,
                                            index
                                        ) => (
                                            <div
                                                className="reason-item"
                                                key={
                                                    index
                                                }
                                            >
                                                {reason}
                                            </div>
                                        )
                                    )}

                                </div>
                            ) : (
                                <div className="no-reasons">
                                    No risk signals were
                                    recorded for this event.
                                </div>
                            )}

                        </div>

                        <div className="investigation-section">

                            <div className="section-label">
                                SECURITY DECISION
                            </div>

                            <div className="decision-card">

                                <div>

                                    <span>
                                        AUTHX RESPONSE
                                    </span>

                                    <strong>
                                        {selectedDecision}
                                    </strong>

                                </div>

                                <span className="decision-arrow">
                                    →
                                </span>

                            </div>

                        </div>

                        <div className="investigation-section">

                            <div className="section-label">
                                EVENT CONTEXT
                            </div>

                            <div className="context-grid">

                                <div>
                                    <label>
                                        IP ADDRESS
                                    </label>

                                    <strong>
                                        {selectedData?.ipAddress ||
                                            "Unknown"}
                                    </strong>
                                </div>

                                <div>
                                    <label>
                                        LOCATION
                                    </label>

                                    <strong>
                                        {getLocation(
                                            evidence?.event ||
                                            selectedEvent
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <label>
                                        DEVICE
                                    </label>

                                    <strong>
                                        {selectedData?.device ||
                                            "Unknown"}
                                    </strong>
                                </div>

                                <div>
                                    <label>
                                        BROWSER
                                    </label>

                                    <strong>
                                        {selectedData?.browser ||
                                            "Unknown"}
                                    </strong>
                                </div>

                                <div>
                                    <label>
                                        TIMEZONE
                                    </label>

                                    <strong>
                                        {selectedData?.timezone ||
                                            "Unknown"}
                                    </strong>
                                </div>

                                <div>
                                    <label>
                                        EVENT TIME
                                    </label>

                                    <strong>
                                        {formatDate(
                                            getTimestamp(
                                                evidence?.event ||
                                                selectedEvent
                                            )
                                        )}
                                    </strong>
                                </div>

                            </div>

                        </div>

                        {evidence?.incident && (
                            <div className="investigation-section">

                                <div className="section-label">
                                    RELATED INCIDENT
                                </div>

                                <div className="incident-evidence-card">

                                    <div>
                                        <span>
                                            SECURITY INCIDENT
                                        </span>

                                        <strong>
                                            Related security incident detected
                                        </strong>
                                    </div>

                                    <span
                                        className={`incident-status ${String(
                                            evidence.incident.status
                                        ).toLowerCase()}`}
                                    >
                                        {
                                            evidence.incident
                                                .status
                                        }
                                    </span>

                                    {evidence.incident
                                        .evidence
                                        ?.length >
                                        0 && (
                                        <div className="incident-evidence-list">

                                            <span>
                                                EVIDENCE
                                            </span>

                                            {evidence.incident.evidence.map(
                                                (
                                                    item,
                                                    index
                                                ) => (
                                                    <div
                                                        key={
                                                            index
                                                        }
                                                    >
                                                        {item}
                                                    </div>
                                                )
                                            )}

                                        </div>
                                    )}

                                </div>

                            </div>
                        )}

                        <div className="investigation-section">

                            <div className="section-label">
                                EVENT ID
                            </div>

                            <div className="event-id-box">
                                {getEventId(
                                    selectedEvent
                                ) ||
                                    "Unavailable"}
                            </div>

                        </div>

                    </aside>

                </div>
            )}

        </div>
    );
};

export default SecurityEvents;