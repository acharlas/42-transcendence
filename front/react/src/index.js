"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = __importDefault(require("react-dom/client"));
const react_router_dom_1 = require("react-router-dom");
const App_1 = __importDefault(require("./App"));
const signin_component_1 = __importDefault(require("./login/signin_component"));
const signup_component_1 = require("./login/signup_component");
const _42_redirec_1 = __importDefault(require("./login/42_redirec"));
const login_mfa_component_1 = __importDefault(require("./login/login_mfa_component"));
const rootElement = document.getElementById("root");
if (!rootElement)
    throw new Error("Failed to find the root element");
const root = client_1.default.createRoot(rootElement);
root.render((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(signin_component_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/signup", element: (0, jsx_runtime_1.jsx)(signup_component_1.SignupForm, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/42-redirect", element: (0, jsx_runtime_1.jsx)(_42_redirec_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/mfa-signin/", element: (0, jsx_runtime_1.jsx)(login_mfa_component_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/app/*", element: (0, jsx_runtime_1.jsx)(App_1.default, {}) })] }) }));
