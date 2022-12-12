"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const hi_1 = require("react-icons/hi");
const chat_context_1 = require("../context/chat.context");
const socket_context_1 = __importDefault(require("../context/socket.context"));
function JoinNewRoomComponent() {
    const newRoomRef = (0, react_1.useRef)(null);
    const newPassRef = (0, react_1.useRef)(null);
    const { socket } = (0, react_1.useContext)(socket_context_1.default).SocketState;
    const { setShowJoinMenu, JoinErrMsg } = (0, chat_context_1.useChat)();
    const handleJoinRoom = (event) => {
        const name = newRoomRef.current.value || "";
        const pass = newPassRef.current.value || "";
        console.log("joining room: ", name);
        socket.emit("JoinRoom", {
            name: name,
            password: pass,
        });
        if (newPassRef.current)
            newPassRef.current.value = "";
        if (newRoomRef.current)
            newRoomRef.current.value = "";
    };
    const handleCloseMenu = (event) => {
        setShowJoinMenu(false);
    };
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "chat-box-container" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "room-chat-option" }, { children: (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleCloseMenu, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(hi_1.HiXCircle, { className: "chat-box-button-icon" }) })) })), (0, jsx_runtime_1.jsxs)("form", Object.assign({ className: "create-join-menu-title" }, { children: [JoinErrMsg ? ((0, jsx_runtime_1.jsx)("p", Object.assign({ className: "room-chat-err-message" }, { children: JoinErrMsg }))) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), "Join Name:", (0, jsx_runtime_1.jsx)("input", { ref: newRoomRef, placeholder: "Room name...", className: "create-join-menu-input" }), (0, jsx_runtime_1.jsx)("p", {}), "Room password", (0, jsx_runtime_1.jsx)("input", { ref: newPassRef, placeholder: "Room password (optional) ...", className: "create-join-menu-input" })] })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "create-join-menu-button", onClick: handleJoinRoom }, { children: "JOIN ROOM" }))] })));
}
exports.default = JoinNewRoomComponent;
