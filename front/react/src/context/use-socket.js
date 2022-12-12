"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSocket = void 0;
const react_1 = require("react");
const socket_io_client_1 = require("socket.io-client");
const useSocket = (uri, opts) => {
    const { current: socket } = (0, react_1.useRef)((0, socket_io_client_1.io)(uri, opts));
    (0, react_1.useEffect)(() => {
        return () => {
            if (socket)
                socket.close();
        };
    }, [socket]);
    return socket;
};
exports.useSocket = useSocket;
