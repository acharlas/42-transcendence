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
const chat_owner_leaving_1 = __importDefault(require("./chat-owner-leaving"));
const type_1 = require("./type");
const ChatOptionComponent = (props) => {
    const newPassword = (0, react_1.useRef)(null);
    const [type, setType] = (0, react_1.useState)(type_1.ChannelType.public);
    const { socket } = (0, react_1.useContext)(socket_context_1.default).SocketState;
    const { setShowRoomSetting, ShowRoomSetting, closeChatBox, CreateErrMsg, setCreateErrMsg, } = (0, chat_context_1.useChat)();
    const newRoomRef = (0, react_1.useRef)(null);
    const [showPopup, setShowPopup] = (0, react_1.useState)(false);
    function handleUpdateRoom() {
        const roomName = newRoomRef.current.value || "";
        let password;
        let updateChannelDto = {
            name: undefined,
            password: undefined,
            type: undefined,
        };
        setCreateErrMsg("");
        if (newPassword.current)
            password = newPassword.current.value || "";
        else
            password = null;
        console.log("create room", roomName, password);
        if (String(roomName).trim())
            updateChannelDto.name = roomName;
        if (type !== ShowRoomSetting.channel.type) {
            if (type === type_1.ChannelType.protected && !password) {
                setCreateErrMsg("protected room must have a password");
                return;
            }
            else {
                updateChannelDto.password = password;
            }
            updateChannelDto.type = type;
        }
        else if (type === type_1.ChannelType.protected &&
            ShowRoomSetting.channel.type === type_1.ChannelType.protected) {
            if (!password) {
                setCreateErrMsg("protected room must have a password");
                return;
            }
            updateChannelDto.type = type_1.ChannelType.protected;
            updateChannelDto.password = password;
        }
        if (updateChannelDto.name || updateChannelDto.type)
            console.log("sending update room: ", { updateChannelDto });
        socket.emit("UpdateRoom", {
            roomId: ShowRoomSetting.channel.id,
            updateChannelDto,
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
        closeChatBox();
    };
    const handleLeaveRoom = (event) => {
        const u = ShowRoomSetting.user.filter((user) => {
            if (user.status === type_1.UserStatus.disconnected)
                return false;
            return true;
        });
        console.log(u);
        if (u.length === 1) {
            socket.emit("LeaveRoom", { roomId: ShowRoomSetting.channel.id });
            setShowRoomSetting(null);
            return;
        }
        setShowPopup(true);
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "chat-box-container" }, { children: [showPopup ? ((0, jsx_runtime_1.jsx)(chat_owner_leaving_1.default, { setShowPopup: setShowPopup })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "room-chat-option" }, { children: (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleCloseMenu, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(hi_1.HiXCircle, { className: "chat-box-button-icon" }) })) })), (0, jsx_runtime_1.jsxs)("form", Object.assign({ className: "create-join-menu-title" }, { children: [CreateErrMsg ? ((0, jsx_runtime_1.jsx)("p", Object.assign({ className: "room-chat-err-message" }, { children: CreateErrMsg }))) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), "Room Name:", (0, jsx_runtime_1.jsx)("input", { ref: newRoomRef, placeholder: "Room name...", className: "create-join-menu-input" }), (0, jsx_runtime_1.jsx)("p", {}), "Room Type:", (0, jsx_runtime_1.jsxs)("select", Object.assign({ onChange: handleChangeSelect, value: type, name: "channel type", id: "channel-select", className: "create-join-menu-input" }, { children: [(0, jsx_runtime_1.jsx)("option", Object.assign({ value: type_1.ChannelType.public }, { children: "public" })), (0, jsx_runtime_1.jsx)("option", Object.assign({ value: type_1.ChannelType.protected }, { children: "protected" })), (0, jsx_runtime_1.jsx)("option", Object.assign({ value: type_1.ChannelType.private }, { children: "private" }))] })), type === type_1.ChannelType.protected ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", {}), "Password:", (0, jsx_runtime_1.jsx)("input", { ref: newPassword, placeholder: "Password optional...", className: "create-join-menu-input" })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "option-menu-button", onClick: handleUpdateRoom }, { children: "update Room" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "option-menu-button", onClick: handleLeaveRoom }, { children: "Leave Room" }))] })) }));
};
exports.default = ChatOptionComponent;
