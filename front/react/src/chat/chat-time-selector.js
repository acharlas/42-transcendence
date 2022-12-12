"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const chat_context_1 = require("../context/chat.context");
const socket_context_1 = __importDefault(require("../context/socket.context"));
const TimeSelector = (props) => {
    const { setShowTimeSelector, showTimeSelector, actChannel, selectUser, setSelectUser, } = (0, chat_context_1.useChat)();
    const { socket } = (0, react_1.useContext)(socket_context_1.default).SocketState;
    const [errorMsg, setErrorMsg] = (0, react_1.useState)("");
    const newDateRef = (0, react_1.useRef)(null);
    const handleCancel = () => {
        setShowTimeSelector(undefined);
    };
    const handleValidate = () => {
        const date = newDateRef.current.value || "";
        console.log(newDateRef.current.value);
        if (!date) {
            setErrorMsg("date format must be mm/dd/yy hour:min AM/PM");
            return;
        }
        const ate = new Date(date);
        console.log(ate);
        socket.emit("UpdateUserPrivilege", {
            roomId: actChannel,
            privilege: showTimeSelector,
            time: ate,
            toModifie: selectUser.username,
        });
        setSelectUser(undefined);
        setShowTimeSelector(undefined);
    };
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "popup-container" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "popup-popup" }, { children: [(0, jsx_runtime_1.jsx)("p", Object.assign({ className: "time-selector-popup-title" }, { children: "ban until:" })), errorMsg.length !== 0 ? ((0, jsx_runtime_1.jsx)("p", Object.assign({ className: "time-selector-popup-error" }, { children: errorMsg }))) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsx)("input", { type: "datetime-local", name: "time", ref: newDateRef, className: "time-selector-popup-input" }), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleCancel, className: "time-selector-popup-button" }, { children: "cancel" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleValidate, className: "time-selector-popup-button" }, { children: "validate" }))] })) })));
};
exports.default = TimeSelector;
