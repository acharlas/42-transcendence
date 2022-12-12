"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const chat_context_1 = require("../context/chat.context");
const socket_context_1 = __importDefault(require("../context/socket.context"));
const type_1 = require("./type");
const ChatOwnerPopupComponent = ({ setShowPopup }) => {
    const [newUser, setUser] = (0, react_1.useState)("");
    const { ShowRoomSetting, setShowRoomSetting } = (0, chat_context_1.useChat)();
    const [errorMsg, setErrorMsg] = (0, react_1.useState)("");
    const { socket } = (0, react_1.useContext)(socket_context_1.default).SocketState;
    const handleCancel = () => {
        setShowPopup(false);
    };
    const handleChangeSelect = (event) => {
        console.log(event.target.value);
        setUser(event.target.value);
    };
    const handleValidate = () => {
        console.log("change owner and leave: ", newUser);
        if (!newUser || newUser.length === 0) {
            setErrorMsg("select a User");
            return;
        }
        socket.emit("UpdateUserPrivilege", {
            roomId: ShowRoomSetting.channel.id,
            privilege: type_1.UserPrivilege.owner,
            time: null,
            toModifie: newUser,
        });
        socket.emit("LeaveRoom", { roomId: ShowRoomSetting.channel.id });
        setShowPopup(false);
        setShowRoomSetting(undefined);
    };
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "popup-container" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "popup-popup" }, { children: [(0, jsx_runtime_1.jsx)("p", Object.assign({ className: "time-selector-popup-title" }, { children: "Choose a new owner:" })), errorMsg.length !== 0 ? ((0, jsx_runtime_1.jsx)("p", Object.assign({ className: "time-selector-popup-error" }, { children: errorMsg }))) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsxs)("select", Object.assign({ onChange: handleChangeSelect, value: newUser, name: "New Owner", id: "owner-select", className: "time-selector-popup-input" }, { children: [(0, jsx_runtime_1.jsx)("option", { value: "" }), ShowRoomSetting.user.map((user, id) => {
                            if (user.status === type_1.UserStatus.connected &&
                                user.privilege !== type_1.UserPrivilege.ban &&
                                user.username !== window.sessionStorage.getItem("username"))
                                return ((0, jsx_runtime_1.jsx)("option", Object.assign({ value: user.username }, { children: user.username }), id));
                            return null;
                        })] })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleCancel, className: "time-selector-popup-button" }, { children: "cancel" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleValidate, className: "time-selector-popup-button" }, { children: "validate" }))] })) })));
};
exports.default = ChatOwnerPopupComponent;
