"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const chat_create_room_1 = __importDefault(require("./chat-create-room"));
const chat_join_new_room_1 = __importDefault(require("./chat-join-new-room"));
const lock_screen_1 = __importDefault(require("./lock-screen"));
function ChatBodyComponent({ socket, setNextRoom, nextRoom, JoinNewRoom, }) {
    if (nextRoom) {
        return ((0, jsx_runtime_1.jsx)(lock_screen_1.default, { socket: socket, nextRoom: nextRoom, setNextRoom: setNextRoom }));
    }
    else if (JoinNewRoom) {
        return (0, jsx_runtime_1.jsx)(chat_join_new_room_1.default, {});
    }
    else {
        return (0, jsx_runtime_1.jsx)(chat_create_room_1.default, {});
    }
}
exports.default = ChatBodyComponent;
