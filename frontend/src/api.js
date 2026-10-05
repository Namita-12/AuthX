import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authXToken");

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

export const login = (data) =>
    api.post("/auth/login", data);

export const getDashboard = () =>
    api.get("/dashboard");

export const getTimeline = (params) =>
    api.get("/security-timeline", {
        params
    });

export const getAnalytics = () =>
    api.get("/security-analytics");
export const getIncidents = () =>
    api.get("/incidents");

export const getIncident = (incidentId) =>
    api.get(`/incidents/${incidentId}`);

export const updateIncidentStatus = (
    incidentId,
    status
) =>
    api.patch(
        `/incidents/${incidentId}/status`,
        { status }
    );
export const getResponseActions = (params) =>
    api.get("/response-actions", {
        params
    });

export const getEvidence = (eventId) =>
    api.get(`/evidence/${eventId}`);

export default api;