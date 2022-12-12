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
const type_1 = require("./type");
function CreateRoomsContainer() {
    const newRoomRef = (0, react_1.useRef)(null);
    const newPassword = (0, react_1.useRef)(null);
    const [type, setType] = (0, react_1.useState)("public");
    const { socket } = (0, react_1.useContext)(socket_context_1.default).SocketState;
    const { setShowCreateMenu, CreateErrMsg, setCreateErrMsg } = (0, chat_context_1.useChat)();
    function handleCreateRoom() {
        console.log("socket", socket);
        const roomName = newRoomRef.current.value || "";
        let password;
        if (newPassword.current)
            password = newPassword.current.value || "";
        else
            password = "";
        console.log("create room", roomName, password);
        if (!String(roomName).trim())
            return;
        if (!password.length && type === type_1.ChannelType.protected) {
            setCreateErrMsg("protected channel must have a password");
            return;
        }
        socket.emit("CreateRoom", {
            roomName,
            CreateChannelDto: { name: roomName, type: type, password: password },
        });
        if (newRoomRef.current)
            newRoomRef.current.value = "";
        if (newPassword.current)
            newPassword.current.value = "";
    }
    const handleChangeSelect = (event) => {
        console.log(event.target.value);
        setType(event.target.value);
        if (event.target.value !== "protected" && newPassword.current)
            newPassword.current.value = "";
    };
    const handleCloseMenu = (event) => {
        setShowCreateMenu(false);
    };
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "chat-box-container" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "room-chat-option" }, { children: (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleCloseMenu, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(hi_1.HiXCircle, { className: "chat-box-button-icon" }) })) })), (0, jsx_runtime_1.jsxs)("form", Object.assign({ className: "create-join-menu-title" }, { children: [CreateErrMsg ? ((0, jsx_runtime_1.jsx)("p", Object.assign({ className: "room-chat-err-message" }, { children: CreateErrMsg }))) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), "Room Name:", (0, jsx_runtime_1.jsx)("input", { ref: newRoomRef, placeholder: "Room name...", className: "create-join-menu-input" }), (0, jsx_runtime_1.jsx)("p", {}), "Room Type:", (0, jsx_runtime_1.jsxs)("select", Object.assign({ onChange: handleChangeSelect, value: type, name: "channel type", id: "channel-select", className: "create-join-menu-input" }, { children: [(0, jsx_runtime_1.jsx)("option", Object.assign({ value: "public" }, { children: "public" })), (0, jsx_runtime_1.jsx)("option", Object.assign({ value: "protected" }, { children: "protected" })), (0, jsx_runtime_1.jsx)("option", Object.assign({ value: "private" }, { children: "private" }))] })), type === "protected" ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", {}), "Password:", (0, jsx_runtime_1.jsx)("input", { ref: newPassword, placeholder: "Password optional...", className: "create-join-menu-input" })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "create-join-menu-button", onClick: handleCreateRoom }, { children: "CREATE ROOM" }))] })));
}
exports.default = CreateRoomsContainer;
