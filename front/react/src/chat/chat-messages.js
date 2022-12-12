"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const chat_context_1 = require("../context/chat.context");
const socket_context_1 = __importDefault(require("../context/socket.context"));
const hi_1 = require("react-icons/hi");
require("./chat-style.css");
const type_1 = require("./type");
const chat_user_menu_1 = __importDefault(require("./chat-user-menu"));
const chat_time_selector_1 = __importDefault(require("./chat-time-selector"));
const chat_invite_user_1 = __importDefault(require("./chat-invite-user"));
function MessagesComponent() {
    const newMessageRef = (0, react_1.useRef)(null);
    const bottomRef = (0, react_1.useRef)(null);
    const { rooms, messages, actChannel, userList, setSelectUser, selectUser, user, showTimeSelector, bloquedList, closeChatBox, setShowInviteUser, showInviteUser, } = (0, chat_context_1.useChat)();
    const { socket } = (0, react_1.useContext)(socket_context_1.default).SocketState;
    (0, react_1.useEffect)(() => {
        var _a;
        (_a = bottomRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    }, []);
    (0, react_1.useEffect)(() => {
        var _a;
        (_a = bottomRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    });
    // bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    function handleSendMessage() {
        const message = newMessageRef.current.value;
        newMessageRef.current.value = "";
        console.log("actual channel send message: ", actChannel);
        if (!String(message).trim()) {
            return;
        }
        if (message[0] != null) {
            userList.find((user) => {
                if (user.username === window.sessionStorage.getItem("username"))
                    return true;
                return false;
            });
            socket.emit("SendRoomMessage", {
                roomId: actChannel,
                message: message,
            });
        }
    }
    const handleShowUser = ({ user }) => {
        if (selectUser && selectUser.username === user.username)
            setSelectUser(undefined);
        else
            setSelectUser(user);
    };
    const handleEnter = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSendMessage();
            newMessageRef.current.value = "";
        }
    };
    const handleCloseChat = (event) => {
        closeChatBox();
    };
    const affInviteUserButton = () => {
        const room = rooms.find((room) => {
            if (room.channel.id === actChannel)
                return true;
            return false;
        });
        if (room.channel.type === type_1.ChannelType.private &&
            (user.privilege === type_1.UserPrivilege.admin ||
                user.privilege === type_1.UserPrivilege.owner)) {
            console.log("true");
            return true;
        }
        return false;
    };
    const handleInviteUser = () => {
        setShowInviteUser(true);
    };
    if (!actChannel)
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "chat-box-container" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "room-chat-option" }, { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleCloseChat, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(hi_1.HiXCircle, { className: "chat-box-button-icon" }) })), affInviteUserButton() && ((0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleInviteUser, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(hi_1.HiPlusSm, { className: "chat-box-button-icon" }) }))), selectUser ? (0, jsx_runtime_1.jsx)(chat_user_menu_1.default, {}) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "room-chat-message-container" }, { children: [messages.map((message, index) => {
                        const msgUser = userList.find((user) => {
                            if (user.username === message.username)
                                return true;
                            return false;
                        });
                        if (!bloquedList.find((bloque) => {
                            if (bloque.username === message.username)
                                return true;
                            return false;
                        }))
                            return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "room-chat-message-text" }, { children: [(0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "room-chat-button-user", onClick: () => handleShowUser({
                                            user: msgUser,
                                        }), disabled: user !== null && user.username === msgUser.username }, { children: [msgUser ? msgUser.nickname : msgUser.nickname, " ", " :"] })), message.content] }), index));
                        return null;
                    }), (0, jsx_runtime_1.jsx)("p", { ref: bottomRef })] })), (0, jsx_runtime_1.jsx)("textarea", { className: "room-chat-textbox", placeholder: "time to talk", ref: newMessageRef, onKeyDown: handleEnter }), showTimeSelector && (0, jsx_runtime_1.jsx)(chat_time_selector_1.default, {}), showInviteUser && (0, jsx_runtime_1.jsx)(chat_invite_user_1.default, {})] })));
}
exports.default = MessagesComponent;
