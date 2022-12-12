"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
require("./style-bandeau.css");
const ri_1 = require("react-icons/ri");
const BandeauIndex = (props) => {
    let navigate = (0, react_router_dom_1.useNavigate)();
    const goProfile = () => {
        navigate("/app/profile/" + window.sessionStorage.getItem("userid"));
    };
    const goLeaderboard = () => {
        navigate("/app/leaderboard");
    };
    const goSettings = () => {
        navigate("/app/settings");
    };
    const goHome = () => {
        navigate("/app");
    };
    const goGame = () => {
        navigate("/app/game");
    };
    const HandleDisconnect = () => {
        navigate("/");
    };
    return ((0, jsx_runtime_1.jsxs)("nav", Object.assign({ className: "bandeau-container" }, { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: goHome, className: "bandeau-button" }, { children: "home" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: goProfile, className: "bandeau-button" }, { children: "profile" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: goLeaderboard, className: "bandeau-button" }, { children: "leaderboard" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: goSettings, className: "bandeau-button" }, { children: "settings" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: goGame, className: "bandeau-button" }, { children: "game" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: HandleDisconnect, className: "bandeau-button" }, { children: (0, jsx_runtime_1.jsx)(ri_1.RiShutDownLine, { className: "bandeau-disconnect-icon" }) }))] })));
};
exports.default = BandeauIndex;
