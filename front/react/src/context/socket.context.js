"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketContextProvider = exports.SocketContextConsumer = exports.SocketReducer = exports.defaultSocketContextState = void 0;
const react_1 = require("react");
exports.defaultSocketContextState = {
    socket: undefined,
    uid: "",
};
const SocketReducer = (state, action) => {
    console.log(`message receive - Action: ${action.type} - payload: `, action.payload);
    switch (action.type) {
        case "update_socket":
            console.log("newsocket", action.payload);
            return Object.assign(Object.assign({}, state), { socket: action.payload });
        case "update_uid":
            return Object.assign(Object.assign({}, state), { uid: action.payload });
        default:
            return Object.assign({}, state);
    }
};
exports.SocketReducer = SocketReducer;
const SocketContext = (0, react_1.createContext)({
    SocketState: exports.defaultSocketContextState,
    SocketDispatch: () => { },
});
exports.SocketContextConsumer = SocketContext.Consumer;
exports.SocketContextProvider = SocketContext.Provider;
exports.default = SocketContext;
