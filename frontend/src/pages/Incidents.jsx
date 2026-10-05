import { useEffect, useMemo, useState } from "react";
import {
    getIncidents,
    updateIncidentStatus
} from "../api";

import "./Incidents.css";

const formatDate = (date) => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleString();
};

const getSeverityClass = (severity) => {
    return String(severity || "LOW").toLowerCase();
};

const getStatusClass = (status) => {
    return String(status || "OPEN").toLowerCase();
};

const formatIncidentType = (type) => {
    if (!type) return "Security Incident";

    return type
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
};

const getRelatedEvent = (incident) => {
    return incident?.relatedEventId || null;
};

function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [selectedIncident, setSelectedIncident] =
        useState(null);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    const [severityFilter, setSeverityFilter] =
        useState("ALL");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const loadIncidents = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getIncidents();

            setIncidents(
                response.data?.incidents || []
            );
        } catch (err) {
            console.error(
                "Failed to load incidents:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load security incidents"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadIncidents();
    }, []);

    const filteredIncidents = useMemo(() => {
        return incidents.filter((incident) => {
            const severityMatch =
                severityFilter === "ALL" ||
                incident.severity === severityFilter;

            const statusMatch =
                statusFilter === "ALL" ||
                incident.status === statusFilter;

            return severityMatch && statusMatch;
        });
    }, [
        incidents,
        severityFilter,
        statusFilter
    ]);

    const statistics = useMemo(() => {
        return {
            total: incidents.length,

            open: incidents.filter(
                (incident) =>
                    incident.status === "OPEN"
            ).length,

            investigating: incidents.filter(
                (incident) =>
                    incident.status ===
                    "INVESTIGATING"
            ).length,

            critical: incidents.filter(
                (incident) =>
                    incident.severity === "CRITICAL"
            ).length,

            high: incidents.filter(
                (incident) =>
                    incident.severity === "HIGH"
            ).length
        };
    }, [incidents]);

    const handleStatusUpdate = async (status) => {
        if (!selectedIncident) return;

        try {
            setUpdating(true);
            setError("");

            const response =
                await updateIncidentStatus(
                    selectedIncident._id,
                    status
                );

            const updatedIncident =
                response.data?.incident;

            if (updatedIncident) {
                setIncidents((current) =>
                    current.map((incident) =>
                        incident._id ===
                        updatedIncident._id
                            ? updatedIncident
                            : incident
                    )
                );

                setSelectedIncident(
                    updatedIncident
                );
            }
        } catch (err) {
            console.error(
                "Failed to update incident:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update incident status"
            );
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="incidents-page">

            <div className="incidents-header">

                <div>
                    <div className="incidents-kicker">
                        SECURITY OPERATIONS
                    </div>

                    <h1>Security Incidents</h1>

                    <p>
                        Investigate detected threats,
                        review evidence, and track
                        incident response.
                    </p>
                </div>

                <button
                    className="incidents-refresh"
                    onClick={loadIncidents}
                    disabled={loading}
                >
                    {loading
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>

            <div className="incident-stats">

                <div className="incident-stat">
                    <span>Total Incidents</span>
                    <strong>
                        {statistics.total}
                    </strong>
                </div>

                <div className="incident-stat">
                    <span>Open</span>
                    <strong>
                        {statistics.open}
                    </strong>
                </div>

                <div className="incident-stat">
                    <span>Investigating</span>
                    <strong>
                        {statistics.investigating}
                    </strong>
                </div>

                <div className="incident-stat">
                    <span>Critical</span>
                    <strong className="critical-text">
                        {statistics.critical}
                    </strong>
                </div>

                <div className="incident-stat">
                    <span>High</span>
                    <strong className="high-text">
                        {statistics.high}
                    </strong>
                </div>

            </div>

            <div className="incidents-toolbar">

                <div className="toolbar-title">
                    INCIDENT QUEUE
                </div>

                <div className="incident-filters">

                    <select
                        value={severityFilter}
                        onChange={(event) =>
                            setSeverityFilter(
                                event.target.value
                            )
                        }
                    >
                        <option value="ALL">
                            All Severity
                        </option>

                        <option value="CRITICAL">
                            Critical
                        </option>

                        <option value="HIGH">
                            High
                        </option>

                        <option value="MEDIUM">
                            Medium
                        </option>

                        <option value="LOW">
                            Low
                        </option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >
                        <option value="ALL">
                            All Status
                        </option>

                        <option value="OPEN">
                            Open
                        </option>

                        <option value="INVESTIGATING">
                            Investigating
                        </option>

                        <option value="RESOLVED">
                            Resolved
                        </option>

                        <option value="DISMISSED">
                            Dismissed
                        </option>
                    </select>

                </div>

            </div>

            {error && (
                <div className="incidents-error">
                    {error}
                </div>
            )}

            <div className="incidents-panel">

                {loading ? (

                    <div className="incidents-empty">

                        <div className="loading-ring" />

                        <strong>
                            Loading incidents...
                        </strong>

                        <span>
                            Fetching security intelligence
                        </span>

                    </div>

                ) : filteredIncidents.length === 0 ? (

                    <div className="incidents-empty">

                        <div className="empty-incident-icon">
                            ◇
                        </div>

                        <strong>
                            No security incidents
                        </strong>

                        <span>
                            No incidents match the
                            current filters.
                        </span>

                    </div>

                ) : (

                    <div className="incident-list">

                        {filteredIncidents.map(
                            (incident) => {

                                const severityClass =
                                    getSeverityClass(
                                        incident.severity
                                    );

                                const statusClass =
                                    getStatusClass(
                                        incident.status
                                    );

                                return (
                                    <div
                                        key={incident._id}
                                        className="incident-card"
                                        onClick={() =>
                                            setSelectedIncident(
                                                incident
                                            )
                                        }
                                    >

                                        <div className="incident-card-main">

                                            <div className="incident-indicator">
                                                <span
                                                    className={`severity-dot ${severityClass}`}
                                                />
                                            </div>

                                            <div className="incident-content">

                                                <div className="incident-title-row">

                                                    <h3>
                                                        {formatIncidentType(
                                                            incident.incidentType
                                                        )}
                                                    </h3>

                                                    <span
                                                        className={`severity-badge ${severityClass}`}
                                                    >
                                                        {
                                                            incident.severity
                                                        }
                                                    </span>

                                                    <span
                                                        className={`status-badge ${statusClass}`}
                                                    >
                                                        {
                                                            incident.status
                                                        }
                                                    </span>

                                                </div>

                                                <p>
                                                    Security event detected with a risk score of{" "}
                                                    {incident.riskScore}
                                                    .
                                                </p>

                                                <div className="incident-meta">

                                                    <span>
                                                        Detected{" "}
                                                        {formatDate(
                                                            incident.detectedAt
                                                        )}
                                                    </span>

                                                    <span>
                                                        Evidence{" "}
                                                        {
                                                            incident.evidence
                                                                ?.length || 0
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="incident-card-right">

                                            <div className="incident-score">

                                                <strong>
                                                    {
                                                        incident.riskScore
                                                    }
                                                </strong>

                                                <span>
                                                    RISK SCORE
                                                </span>

                                            </div>

                                            <div className="incident-arrow">
                                                →
                                            </div>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                )}

            </div>

            {selectedIncident && (

                <div
                    className="incident-overlay"
                    onClick={() =>
                        setSelectedIncident(null)
                    }
                >

                    <div
                        className="incident-drawer"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="drawer-header">

                            <div>

                                <div className="incidents-kicker">
                                    INCIDENT INVESTIGATION
                                </div>

                                <h2>
                                    {formatIncidentType(
                                        selectedIncident.incidentType
                                    )}
                                </h2>

                            </div>

                            <button
                                className="drawer-close"
                                onClick={() =>
                                    setSelectedIncident(
                                        null
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="drawer-overview">

                            <div>
                                <span>SEVERITY</span>

                                <strong
                                    className={`severity-value ${getSeverityClass(
                                        selectedIncident.severity
                                    )}`}
                                >
                                    {
                                        selectedIncident.severity
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>RISK SCORE</span>

                                <strong>
                                    {
                                        selectedIncident.riskScore
                                    }
                                    <small>/100</small>
                                </strong>
                            </div>

                            <div>
                                <span>STATUS</span>

                                <strong>
                                    {
                                        selectedIncident.status
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="investigation-section">

                            <div className="section-label">
                                INCIDENT TIMELINE
                            </div>

                            <div className="incident-timeline">

                                <div className="timeline-item">

                                    <span className="timeline-dot" />

                                    <div>
                                        <strong>
                                            Incident detected
                                        </strong>

                                        <small>
                                            {formatDate(
                                                selectedIncident.detectedAt
                                            )}
                                        </small>
                                    </div>

                                </div>

                                {selectedIncident.status ===
                                    "RESOLVED" && (

                                    <div className="timeline-item">

                                        <span className="timeline-dot resolved" />

                                        <div>
                                            <strong>
                                                Incident resolved
                                            </strong>

                                            <small>
                                                {formatDate(
                                                    selectedIncident.resolvedAt ||
                                                    selectedIncident.updatedAt
                                                )}
                                            </small>
                                        </div>

                                    </div>
                                )}

                            </div>

                        </div>

                        <div className="investigation-section">

                            <div className="section-label">
                                EVIDENCE
                            </div>

                            {selectedIncident.evidence
                                ?.length ? (

                                <div className="evidence-list">

                                    {selectedIncident.evidence.map(
                                        (item, index) => (

                                            <div
                                                className="evidence-item"
                                                key={`${selectedIncident._id}-evidence-${index}`}
                                            >

                                                <span>
                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}
                                                </span>

                                                <p>
                                                    {item}
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="no-evidence">
                                    No evidence recorded.
                                </div>

                            )}

                        </div>

                        <div className="investigation-section">

                            <div className="section-label">
                                RELATED EVENT
                            </div>

                            {(() => {

                                const event =
                                    getRelatedEvent(
                                        selectedIncident
                                    );

                                if (!event) {
                                    return (
                                        <div className="no-evidence">
                                            Related event unavailable.
                                        </div>
                                    );
                                }

                                return (
                                    <div className="related-event">

                                        <div>
                                            <span>
                                                EVENT TYPE
                                            </span>

                                            <strong>
                                                {
                                                    event.eventType ||
                                                    "Unknown"
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                RISK LEVEL
                                            </span>

                                            <strong>
                                                {
                                                    event.riskLevel ||
                                                    "Unknown"
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                IP ADDRESS
                                            </span>

                                            <strong>
                                                {
                                                    event.ipAddress ||
                                                    "Unavailable"
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                DEVICE
                                            </span>

                                            <strong>
                                                {
                                                    event.device ||
                                                    "Unknown"
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                BROWSER
                                            </span>

                                            <strong>
                                                {
                                                    event.browser ||
                                                    "Unknown"
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                TIMESTAMP
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    event.timestamp
                                                )}
                                            </strong>
                                        </div>

                                    </div>
                                );
                            })()}

                        </div>

                        <div className="investigation-section">

                            <div className="section-label">
                                UPDATE STATUS
                            </div>

                            <div className="status-actions">

                                {selectedIncident.status !==
                                    "OPEN" && (

                                    <button
                                        disabled={updating}
                                        onClick={() =>
                                            handleStatusUpdate(
                                                "OPEN"
                                            )
                                        }
                                    >
                                        Reopen
                                    </button>
                                )}

                                {selectedIncident.status !==
                                    "INVESTIGATING" && (

                                    <button
                                        disabled={updating}
                                        onClick={() =>
                                            handleStatusUpdate(
                                                "INVESTIGATING"
                                            )
                                        }
                                    >
                                        Investigate
                                    </button>
                                )}

                                {selectedIncident.status !==
                                    "RESOLVED" && (

                                    <button
                                        disabled={updating}
                                        onClick={() =>
                                            handleStatusUpdate(
                                                "RESOLVED"
                                            )
                                        }
                                    >
                                        Resolve
                                    </button>
                                )}

                                {selectedIncident.status !==
                                    "DISMISSED" && (

                                    <button
                                        className="dismiss-button"
                                        disabled={updating}
                                        onClick={() =>
                                            handleStatusUpdate(
                                                "DISMISSED"
                                            )
                                        }
                                    >
                                        Dismiss
                                    </button>
                                )}

                            </div>

                            {updating && (
                                <div className="updating-text">
                                    Updating incident status...
                                </div>
                            )}

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Incidents;