"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const chat_context_1 = require("../context/chat.context");
const socket_context_1 = __importDefault(require("../context/socket.context"));
const InviteUser = (props) => {
    const { setShowInviteUser, actChannel } = (0, chat_context_1.useChat)();
    const { socket } = (0, react_2.useContext)(socket_context_1.default).SocketState;
    const [errorMsg, setErrorMsg] = (0, react_2.useState)("");
    const userInvite = (0, react_2.useRef)(null);
    const handleCancel = () => {
        setShowInviteUser(false);
    };
    const handleValidate = () => {
        setErrorMsg("");
        console.log("socket", socket);
        const userName = userInvite.current.value || "";
        console.log("invite user: ", userName);
        if (!String(userName).trim() && userName.length === 0) {
            setErrorMsg("enter a username");
            return;
        }
        socket.emit("InviteUser", { user: userName, channel: actChannel });
        setShowInviteUser(false);
    };
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "popup-container" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "popup-popup" }, { children: [(0, jsx_runtime_1.jsx)("p", Object.assign({ className: "time-selector-popup-title" }, { children: "User to Invite" })), errorMsg.length !== 0 ? ((0, jsx_runtime_1.jsx)("p", Object.assign({ className: "time-selector-popup-error" }, { children: errorMsg }))) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsx)("input", { ref: userInvite, placeholder: "Username...", className: "time-selector-popup-input" }), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleCancel, className: "time-selector-popup-button" }, { children: "cancel" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleValidate, className: "time-selector-popup-button" }, { children: "validate" }))] })) })));
};
exports.default = InviteUser;
