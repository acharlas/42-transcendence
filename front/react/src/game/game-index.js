"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const game_context_1 = __importDefault(require("../context/game.context"));
const game_component_1 = __importDefault(require("./game-component"));
const socket_game_component_1 = __importDefault(require("./socket-game-component"));
const GameIndex = (props) => {
    return ((0, jsx_runtime_1.jsx)(game_context_1.default, { children: (0, jsx_runtime_1.jsx)(socket_game_component_1.default, { children: (0, jsx_runtime_1.jsx)(game_component_1.default, {}) }) }));
};
exports.default = GameIndex;
