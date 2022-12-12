"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const fa_1 = require("react-icons/fa");
const chat_context_1 = require("../context/chat.context");
function LockScreen({ socket, nextRoom, setNextRoom, }) {
    const newPassword = (0, react_1.useRef)(null);
    const { actChannel } = (0, chat_context_1.useChat)();
    const handleConnectButton = (event) => {
        const pass = newPassword.current.value;
        console.log("next room:", nextRoom, actChannel);
        socket.emit("JoinRoom", { key: nextRoom, old: actChannel, password: pass });
        setNextRoom("");
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(fa_1.FaLock, {}) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("input", { ref: newPassword, placeholder: "Password..." }), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleConnectButton }, { children: "connect" }))] })] }));
}
exports.default = LockScreen;
