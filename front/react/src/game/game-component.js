"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const game_context_1 = require("../context/game.context");
const socket_context_1 = __importDefault(require("../context/socket.context"));
const GameComponent = (props) => {
    const { socket } = (0, react_1.useContext)(socket_context_1.default).SocketState;
    const { inQueue, lobby } = (0, game_context_1.useGame)();
    const handleClick = () => {
        socket.emit("JoiningQueue");
    };
    console.log({ inQueue });
    return ((0, jsx_runtime_1.jsxs)("div", { children: [inQueue ? ((0, jsx_runtime_1.jsx)("button", { children: "waiting for player" })) : ((0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleClick }, { children: "join matchmaking" }))), lobby && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { children: lobby.playerOne }), " ", (0, jsx_runtime_1.jsx)("button", { children: lobby.playerTwo })] }))] }));
};
exports.default = GameComponent;
