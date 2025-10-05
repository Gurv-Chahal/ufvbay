import { StrictMode } from "react";
/* @jsxRuntime classic */
import React from 'react';
import axios from "axios";
import ErrorBoundary from "./ErrorBoundary.jsx";


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations?.().then((regs) => {
        regs.forEach((r) => r.unregister());
    });
}
// also recommend a hard reload once in the browser: open DevTools → Network → check “Disable cache” → reload.



if (import.meta.env.DEV) {
    import('react/jsx-runtime').then(mod => {
        console.log('jsx-runtime:', typeof mod.jsx, typeof mod.jsxs);
    });
}



// ---- HTTP logging (install once) ----
if (!window.__HTTP_LOGGER_INSTALLED__) {
    // 1) Log default axios instance requests/responses
    axios.interceptors.request.use((config) => {
        console.log(
            "[AXIOS REQ]",
            (config.method || "get").toUpperCase(),
            "baseURL:",
            config.baseURL || "(none)",
            "url:",
            config.url || "(none)"
        );
        return config;
    });
    axios.interceptors.response.use(
        (res) => {
            console.log("[AXIOS RES]", res.status, res.config?.url);
            return res;
        },
        (err) => {
            const { response, config } = err || {};
            console.log("[AXIOS ERR]", response?.status, config?.url);
            return Promise.reject(err);
        }
    );

    // 2) Log ALL XHRs (captures axios.create instances too)
    (function () {
        const _open = XMLHttpRequest.prototype.open;
        const _send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            this.__method = method;
            this.__url = url;
            return _open.call(this, method, url, ...rest);
        };
        XMLHttpRequest.prototype.send = function (body) {
            const method = this.__method;
            const url = this.__url;
            this.addEventListener("load", function () {
                console.log("[XHR]", method, url, "→", this.status);
            });
            return _send.call(this, body);
        };
    })();

    // 3) (Optional) Log fetch()
    const _fetch = window.fetch.bind(window);
    window.fetch = (...args) => {
        console.log("[FETCH]", args[0]);
        return _fetch(...args).then((r) => {
            console.log("[FETCH RES]", r.status, args[0]);
            return r;
        });
    };

    window.__HTTP_LOGGER_INSTALLED__ = true;
}
// ---- end logging ----












import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";




// IMPORTANT - DO NOT ADD STRICT MODE IT CREATES A BUG WITH THE CHAT FUNCTION

createRoot(document.getElementById("root")).render(

    <React.StrictMode>
        <ErrorBoundary><App /></ErrorBoundary>
    </React.StrictMode>
);
