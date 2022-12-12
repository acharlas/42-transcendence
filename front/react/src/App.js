"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
require("./style.css");
const auth_api_1 = require("./api/auth-api");
const socket_component_1 = __importDefault(require("./chat/socket-component"));
const chat_index_1 = __importDefault(require("./chat/chat-index"));
const bandeau_1 = __importDefault(require("./bandeau/bandeau"));
const chat_context_1 = __importDefault(require("./context/chat.context"));
const home_index_1 = __importDefault(require("./home/home_index"));
const profile_component_1 = __importDefault(require("./profile/profile_component"));
const settings_component_1 = __importDefault(require("./settings/settings_component"));
const leaderboard_component_1 = __importDefault(require("./leaderboard/leaderboard_component"));
const game_index_1 = __importDefault(require("./game/game-index"));
const App = (props) => {
    (0, react_1.useEffect)(() => {
        (0, auth_api_1.getMe)({ token: window.sessionStorage.getItem("Token") });
    }, []);
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "container" }, { children: (0, jsx_runtime_1.jsx)(chat_context_1.default, { children: (0, jsx_runtime_1.jsxs)(socket_component_1.default, { children: [(0, jsx_runtime_1.jsx)(bandeau_1.default, {}), (0, jsx_runtime_1.jsx)(chat_index_1.default, {}), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(home_index_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/settings", element: (0, jsx_runtime_1.jsx)(settings_component_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/profile/:id", element: (0, jsx_runtime_1.jsx)(profile_component_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/leaderboard", element: (0, jsx_runtime_1.jsx)(leaderboard_component_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/game", element: (0, jsx_runtime_1.jsx)(game_index_1.default, {}) })] })] }) }) })));
};
exports.default = App;
