import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import {
    Routes,
    Route,
    Navigate,
    Link
} from "react-router-dom";

import SecurityEvents from "./pages/SecurityEvents";
ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);