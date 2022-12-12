"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGame = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const GameContext = (0, react_1.createContext)({
    inQueue: false,
    setInQueue: () => { },
    lobby: undefined,
    setLobby: () => { },
});
function GameProvider(props) {
    const [inQueue, setInQueue] = (0, react_1.useState)(false);
    const [lobby, setLobby] = (0, react_1.useState)(null);
    return ((0, jsx_runtime_1.jsx)(GameContext.Provider, Object.assign({ value: {
            inQueue,
            setInQueue,
            lobby,
            setLobby,
        } }, props)));
}
const useGame = () => (0, react_1.useContext)(GameContext);
exports.useGame = useGame;
exports.default = GameProvider;
