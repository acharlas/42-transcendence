"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./chat-style.css");
const chat_context_1 = require("../context/chat.context");
const chat_rooms_menu_1 = __importDefault(require("./chat-rooms-menu"));
const chat_messages_1 = __importDefault(require("./chat-messages"));
const chat_create_room_1 = __importDefault(require("./chat-create-room"));
const chat_join_new_room_1 = __importDefault(require("./chat-join-new-room"));
const chat_option_1 = __importDefault(require("./chat-option"));
const md_1 = require("react-icons/md");
const ChatIndex = (props) => {
    const { rooms, actChannel, showCreateMenu, showJoinMenu, ShowRoomSetting, setShowChat, showChat, } = (0, chat_context_1.useChat)();
    const handleShow = () => {
        setShowChat(true);
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: showChat ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "chat-container" }, { children: (0, jsx_runtime_1.jsx)(chat_rooms_menu_1.default, { setShow: setShowChat }) })), (0, jsx_runtime_1.jsxs)("div", { children: [actChannel ? ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(chat_messages_1.default, {}) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), showCreateMenu ? (0, jsx_runtime_1.jsx)(chat_create_room_1.default, {}) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), showJoinMenu ? (0, jsx_runtime_1.jsx)(chat_join_new_room_1.default, {}) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), ShowRoomSetting ? (0, jsx_runtime_1.jsx)(chat_option_1.default, {}) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})] })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleShow, className: "menu-user-button" }, { children: rooms.find((room) => {
                    if (room.newMessage)
                        return true;
                    return false;
                }) ? ((0, jsx_runtime_1.jsx)(md_1.MdMarkChatUnread, { className: "menu-user-icon" })) : ((0, jsx_runtime_1.jsx)(md_1.MdMarkChatRead, { className: "menu-user-icon" })) })) })) }));
};
exports.default = ChatIndex;
