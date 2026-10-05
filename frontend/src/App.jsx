
import {
    Routes,
    Route,
    Link,
    Navigate,
    useLocation,
    useNavigate
} from "react-router-dom";

import { useEffect, useState } from "react";
import "./App.css";
import {
    getDashboard,
    login
} from "./api";

import SecurityEvents from "./pages/SecurityEvents";
import Incidents from "./pages/Incidents";


/* =========================================================
   LOGIN PAGE
========================================================= */

function Login({ onLogin }) {

    const navigate = useNavigate();

    const [userId, setUserId] =
        useState("");

    const [credential, setCredential] =
        useState("");

    const [ipAddress, setIpAddress] =
        useState("192.168.1.10");

    const [device, setDevice] =
        useState("Windows Laptop");

    const [browser, setBrowser] =
        useState("Chrome");

    const [location, setLocation] =
        useState("Bengaluru");

    const [timezone, setTimezone] =
        useState("Asia/Kolkata");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleLogin = async (event) => {

        event.preventDefault();

        setLoading(true);
        setError("");

        try {

            const response = await login({
                userId,
                credential,
                ipAddress,
                location,
                device,
                browser,
                timezone
            });

            const data =
                response.data;


            if (data.accessToken) {

                localStorage.setItem(
    "authXToken",
    data.accessToken
);

onLogin(data.accessToken);

navigate("/");
                return;
            }


            if (
                response.status === 202 ||
                data.eventId
            ) {

                setError(
                    data.message ||
                    "Additional authentication is required."
                );

                return;
            }


            setError(
                data.message ||
                "Authentication was not completed."
            );

        } catch (err) {

            console.error(
                "Login failed:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="login-page">

            <div className="login-glow" />

            <div className="login-card">

                <div className="brand">

                    <div className="brand-icon">
                        AX
                    </div>

                    <div>
                        <h1>
                            AuthX
                        </h1>

                        <span>
                            Security Intelligence
                        </span>
                    </div>

                </div>


                <div className="login-heading">

                    <h2>
                        Sign in
                    </h2>

                    <p>
                        Authenticate with AuthX to
                        evaluate account security,
                        behavioral trust and risk.
                    </p>

                </div>


                <form onSubmit={handleLogin}>

                    <label>
                        User ID
                    </label>

                    <input
                        type="text"
                        value={userId}
                        onChange={(event) =>
                            setUserId(
                                event.target.value
                            )
                        }
                        placeholder="Enter user ID"
                        required
                    />


                    <label>
                        Credential
                    </label>

                    <input
                        type="password"
                        value={credential}
                        onChange={(event) =>
                            setCredential(
                                event.target.value
                            )
                        }
                        placeholder="Enter credential"
                        required
                    />


                    <label>
                        IP Address
                    </label>

                    <input
                        type="text"
                        value={ipAddress}
                        onChange={(event) =>
                            setIpAddress(
                                event.target.value
                            )
                        }
                        required
                    />


                    <label>
                        Device
                    </label>

                    <input
                        type="text"
                        value={device}
                        onChange={(event) =>
                            setDevice(
                                event.target.value
                            )
                        }
                        required
                    />


                    <label>
                        Browser
                    </label>

                    <input
                        type="text"
                        value={browser}
                        onChange={(event) =>
                            setBrowser(
                                event.target.value
                            )
                        }
                        required
                    />


                    <label>
                        Location
                    </label>

                    <input
                        type="text"
                        value={location}
                        onChange={(event) =>
                            setLocation(
                                event.target.value
                            )
                        }
                        required
                    />


                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Authenticating..."
                            : "Authenticate"}
                    </button>


                    {error && (
                        <div className="error-box">
                            {error}
                        </div>
                    )}

                </form>


                <div className="login-footer">

                    <span className="status-dot" />

                    <span>
                        Protected by AuthX
                        security intelligence
                    </span>

                </div>

            </div>

        </div>
    );
}


/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar() {

    const location =
        useLocation();

    const navigate =
        useNavigate();


    const handleLogout = () => {

        localStorage.removeItem(
            "authXToken"
        );

        navigate("/login");

    };


    return (
        <aside className="sidebar">

            {/* BRAND */}

            <div className="sidebar-brand">

                <div className="brand-icon">
                    AX
                </div>

                <div>

                    <strong>
                        AuthX
                    </strong>

                    <span>
                        Security Intelligence
                    </span>

                </div>

            </div>


            {/* NAVIGATION */}

            <nav>

                <Link
                    to="/"
                    className={`nav-item ${
                        location.pathname === "/"
                            ? "active"
                            : ""
                    }`}
                >

                    <span>
                        ◈
                    </span>

                    Dashboard

                </Link>


                <Link
                    to="/events"
                    className={`nav-item ${
                        location.pathname === "/events"
                            ? "active"
                            : ""
                    }`}
                >

                    <span>
                        ◉
                    </span>

                    Security Events

                </Link>


                <Link
                    to="/incidents"
                    className={`nav-item ${
                        location.pathname === "/incidents"
                            ? "active"
                            : ""
                    }`}
                >

                    <span>
                        ◆
                    </span>

                    Incidents

                </Link>

            </nav>


            {/* SIDEBAR BOTTOM */}

            <div className="sidebar-bottom">

                <div className="system-status">

                    <span className="status-dot" />

                    <div>

                        <strong>
                            AuthX Online
                        </strong>

                        <small>
                            Security engine active
                        </small>

                    </div>

                </div>


                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </aside>
    );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getDashboard();

            setDashboard(
                response.data.dashboard
            );

        } catch (err) {

            console.error(
                "Dashboard loading failed:",
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
                "Failed to load security dashboard"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadDashboard();

    }, []);


    if (loading) {

        return (
            <div className="dashboard-page">

                <main className="main-content">

                    <div className="topbar">

                        <div>

                            <p className="eyebrow">
                                AUTHX SECURITY INTELLIGENCE
                            </p>

                            <h1>
                                Security Dashboard
                            </h1>

                            <p className="subtitle">
                                Loading security intelligence...
                            </p>

                        </div>

                    </div>

                </main>

            </div>
        );
    }


    if (error) {

        return (
            <div className="dashboard-page">

                <main className="main-content">

                    <div className="topbar">

                        <div>

                            <p className="eyebrow">
                                AUTHX SECURITY INTELLIGENCE
                            </p>

                            <h1>
                                Security Dashboard
                            </h1>

                            <p className="subtitle">
                                Unable to load dashboard
                            </p>

                        </div>

                        <button
                            className="refresh-button"
                            onClick={loadDashboard}
                        >
                            Retry
                        </button>

                    </div>

                    <div className="panel">
                        {error}
                    </div>

                </main>

            </div>
        );
    }


    const trust =
        dashboard?.trust || {};

    const authentication =
        dashboard?.statistics?.authentication || {};

    const risk =
        dashboard?.statistics?.risk || {};

    const security =
        dashboard?.statistics?.security || {};

    const recentEvents =
        dashboard?.recentEvents || [];


    const totalRisk =
        (risk.low || 0) +
        (risk.medium || 0) +
        (risk.high || 0) +
        (risk.critical || 0);


    const riskPercent = (value) => {

        if (!totalRisk) {
            return 0;
        }

        return Math.max(
            4,
            Math.round(
                (value / totalRisk) * 100
            )
        );
    };


    const formatEventType = (eventType) => {

        return (
            eventType
                ?.replace("LOGIN_", "")
                ?.replaceAll("_", " ")
                ?.toLowerCase()
                ?.replace(/\b\w/g, char =>
                    char.toUpperCase()
                ) ||
            "Security Event"
        );
    };


    const formatTime = (timestamp) => {

        if (!timestamp) {
            return "Unknown time";
        }

        return new Date(
            timestamp
        ).toLocaleString();
    };


    return (
        <div className="dashboard-page">

            <main className="main-content">

                {/* ================= TOPBAR ================= */}

                <div className="topbar">

                    <div>

                        <p className="eyebrow">
                            AUTHX SECURITY INTELLIGENCE
                        </p>

                        <h1>
                            Security Dashboard
                        </h1>

                        <p className="subtitle">
                            Monitor authentication,
                            adaptive trust and
                            account security signals.
                        </p>

                    </div>


                    <div className="topbar-actions">

                        <div className="live-status">

                            <span className="status-dot" />

                            SYSTEM LIVE

                        </div>


                        <button
                            className="refresh-button"
                            onClick={loadDashboard}
                        >
                            Refresh
                        </button>

                    </div>

                </div>


                {/* ================= TRUST ================= */}

                <div className="trust-hero">

                    <div className="trust-info">

                        <p className="section-label">
                            ADAPTIVE ACCOUNT TRUST
                        </p>

                        <div className="trust-score">

                            {trust.trustScore ?? 0}

                            <span>
                                /100
                            </span>

                        </div>


                        <div className="trust-level">

                            <span className="trust-check">
                                ✓
                            </span>

                            {trust.trustLevel ||
                                "NORMAL"}

                        </div>


                        <p>
                            AuthX continuously evaluates
                            authentication behavior,
                            device context, location,
                            timing and security signals
                            to estimate account trust.
                        </p>

                    </div>


                    <div className="trust-ring">

                        <div className="ring-inner">

                            <strong>
                                {trust.trustScore ?? 0}
                            </strong>

                            <span>
                                TRUST SCORE
                            </span>

                        </div>

                    </div>

                </div>


                {/* ================= AUTHENTICATION ================= */}

                <div className="section-title">

                    <span>
                        Authentication Activity
                    </span>

                    <small>
                        ACCOUNT EVENTS
                    </small>

                </div>


                <div className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon success">
                            ✓
                        </div>

                        <div>

                            <span>
                                Successful
                            </span>

                            <strong>
                                {authentication.successfulLogins || 0}
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon danger">
                            !
                        </div>

                        <div>

                            <span>
                                Failed
                            </span>

                            <strong>
                                {authentication.failedLogins || 0}
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon warning">
                            ?
                        </div>

                        <div>

                            <span>
                                Challenges
                            </span>

                            <strong>
                                {authentication.challenges || 0}
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon blocked">
                            ×
                        </div>

                        <div>

                            <span>
                                Blocked
                            </span>

                            <strong>
                                {authentication.blockedLogins || 0}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* ================= ANALYSIS ================= */}

                <div className="content-grid">

                    {/* RISK */}

                    <div className="panel">

                        <div className="panel-header">

                            <div>

                                <p className="section-label">
                                    THREAT DISTRIBUTION
                                </p>

                                <h2>
                                    Risk Analysis
                                </h2>

                            </div>

                        </div>


                        <div>

                            <div className="risk-row">

                                <div className="risk-label">

                                    <span className="risk-dot low" />

                                    Low

                                    <strong>
                                        {risk.low || 0}
                                    </strong>

                                </div>

                                <div className="risk-track">

                                    <div
                                        className="risk-fill low"
                                        style={{
                                            width:
                                                `${riskPercent(
                                                    risk.low || 0
                                                )}%`
                                        }}
                                    />

                                </div>

                            </div>


                            <div className="risk-row">

                                <div className="risk-label">

                                    <span className="risk-dot medium" />

                                    Medium

                                    <strong>
                                        {risk.medium || 0}
                                    </strong>

                                </div>

                                <div className="risk-track">

                                    <div
                                        className="risk-fill medium"
                                        style={{
                                            width:
                                                `${riskPercent(
                                                    risk.medium || 0
                                                )}%`
                                        }}
                                    />

                                </div>

                            </div>


                            <div className="risk-row">

                                <div className="risk-label">

                                    <span className="risk-dot high" />

                                    High

                                    <strong>
                                        {risk.high || 0}
                                    </strong>

                                </div>

                                <div className="risk-track">

                                    <div
                                        className="risk-fill high"
                                        style={{
                                            width:
                                                `${riskPercent(
                                                    risk.high || 0
                                                )}%`
                                        }}
                                    />

                                </div>

                            </div>


                            <div className="risk-row">

                                <div className="risk-label">

                                    <span className="risk-dot critical" />

                                    Critical

                                    <strong>
                                        {risk.critical || 0}
                                    </strong>

                                </div>

                                <div className="risk-track">

                                    <div
                                        className="risk-fill critical"
                                        style={{
                                            width:
                                                `${riskPercent(
                                                    risk.critical || 0
                                                )}%`
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* SECURITY SUMMARY */}

                    <div className="panel">

                        <div className="panel-header">

                            <div>

                                <p className="section-label">
                                    SECURITY ACTIVITY
                                </p>

                                <h2>
                                    Security Summary
                                </h2>

                            </div>

                        </div>


                        <div className="summary-list">

                            <div className="summary-row">

                                <span>
                                    Open incidents
                                </span>

                                <strong>
                                    {security.openIncidents || 0}
                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Recent events
                                </span>

                                <strong>
                                    {security.recentEvents || 0}
                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Response actions
                                </span>

                                <strong>
                                    {security.recentResponseActions || 0}
                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Executed responses
                                </span>

                                <strong>
                                    {security.executedResponses || 0}
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= RECENT EVENTS ================= */}

                <div className="events-panel panel">

                    <div className="panel-header">

                        <div>

                            <p className="section-label">
                                SECURITY TELEMETRY
                            </p>

                            <h2>
                                Recent Security Events
                            </h2>

                        </div>


                        <Link
                            to="/events"
                            className="event-count"
                        >
                            View all events →
                        </Link>

                    </div>


                    <div className="events-list">

                        {recentEvents.length === 0 ? (

                            <div className="summary-row">

                                <span>
                                    No recent security events
                                </span>

                            </div>

                        ) : (

                            recentEvents
                                .slice(0, 5)
                                .map((event) => (

                                    <div
                                        className="event-row"
                                        key={event._id}
                                    >

                                        <span
                                            className={`event-marker ${
                                                event.riskLevel
                                                    ?.toLowerCase() ||
                                                "low"
                                            }`}
                                        >
                                            ●
                                        </span>


                                        <div className="event-main">

                                            <strong>
                                                {formatEventType(
                                                    event.eventType
                                                )}
                                            </strong>

                                            <span>
                                                {formatTime(
                                                    event.timestamp
                                                )}
                                            </span>

                                        </div>


                                        <div className="event-risk">

                                            <strong>
                                                {event.riskLevel ||
                                                    "LOW"}
                                            </strong>

                                            <span>
                                                Risk{" "}
                                                {event.riskScore ??
                                                    0}
                                            </span>

                                        </div>

                                    </div>

                                ))

                        )}

                    </div>

                </div>


                {/* ================= FOOTER ================= */}

                <footer>

                    AuthX Security Intelligence

                    <span>
                        •
                    </span>

                    Explainable authentication
                    security

                </footer>

            </main>

        </div>
    );
}


/* =========================================================
   APP ROUTER
========================================================= */

function App() {

    const [token, setToken] = useState(
        () => localStorage.getItem("authXToken")
    );


    const handleLogin = (newToken) => {

        setToken(newToken);

    };


    return (
        <Routes>

            {/* LOGIN */}

            <Route
                path="/login"
                element={
                    token
                        ? (
                            <Navigate
                                to="/"
                                replace
                            />
                        )
                        : (
                            <Login
                                onLogin={handleLogin}
                            />
                        )
                }
            />


            {/* DASHBOARD */}

            <Route
                path="/"
                element={
                    token
                        ? (
                            <>
                                <Sidebar />
                                <Dashboard />
                            </>
                        )
                        : (
                            <Navigate
                                to="/login"
                                replace
                            />
                        )
                }
            />


            {/* SECURITY EVENTS */}

            <Route
                path="/events"
                element={
                    token
                        ? (
                            <>
                                <Sidebar />

                                <main className="main-content">
                                    <SecurityEvents />
                                </main>
                            </>
                        )
                        : (
                            <Navigate
                                to="/login"
                                replace
                            />
                        )
                }
            />


            {/* SECURITY INCIDENTS */}

            <Route
                path="/incidents"
                element={
                    token
                        ? (
                            <>
                                <Sidebar />

                                <main className="main-content">
                                    <Incidents />
                                </main>
                            </>
                        )
                        : (
                            <Navigate
                                to="/login"
                                replace
                            />
                        )
                }
            />


            {/* FALLBACK */}

            <Route
                path="*"
                element={
                    <Navigate
                        to={
                            token
                                ? "/"
                                : "/login"
                        }
                        replace
                    />
                }
            />

        </Routes>
    );
}

  

export default App;

