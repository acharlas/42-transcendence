"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const game_context_1 = require("../context/game.context");
const socket_context_1 = require("../context/socket.context");
const use_socket_1 = require("../context/use-socket");
const SocketGameContextComponent = (props) => {
    const { children } = props;
    const [SocketState, SocketDispatch] = (0, react_1.useReducer)(socket_context_1.SocketReducer, socket_context_1.defaultSocketContextState);
    const { setInQueue, setLobby, lobby, inQueue } = (0, game_context_1.useGame)();
    const socket = (0, use_socket_1.useSocket)("http://localhost:3333/game", {
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        autoConnect: false,
        auth: {
            token: sessionStorage.getItem("Token"),
        },
    });
    (0, react_1.useEffect)(() => {
        /** connect to the web socket */
        console.log("SOCKET CONNECT");
        socket.connect();
        /** save socket in context */
        SocketDispatch({ type: "update_socket", payload: socket });
    }, [socket]);
    (0, react_1.useEffect)(() => {
        /** start the event listeners */
        socket.removeAllListeners();
        const StartListener = () => {
            /**disconnect */
            socket.on("Disconnect", () => {
                console.log("disconnect");
                socket.disconnect();
            });
            /**handshake */
            socket.on("handshake", (id) => {
                console.log("user id is: ", id);
            });
            /**Queue Join */
            socket.on("QueueJoin", () => {
                console.log("joining the queue ");
                setInQueue(true);
            });
            /**new match found*/
            socket.on("'JoinLobby'", (lobby) => {
                console.log("new lobby arrive ");
                setInQueue(false);
                setLobby(lobby);
            });
            /** receive new id */
            socket.on("new_user", (uid) => {
                console.log("User connected, new user receive", uid, "last uid");
                SocketDispatch({ type: "update_uid", payload: uid });
            });
            /** reconnect event*/
            socket.io.on("reconnect", (attempt) => {
                console.log("reconnect on attempt: " + attempt);
            });
            /**reconnect attempt event */
            socket.io.on("reconnect_attempt", (attempt) => {
                console.log("reconnect on attempt: " + attempt);
            });
            /**Reconnection error */
            socket.io.on("reconnect_error", (error) => {
                console.log("reconnect error: " + error);
            });
            /**Reconnection failed */
            socket.io.on("reconnect_failed", () => {
                console.log("reconnection failed ");
                alert("we are unable to reconnect you to the web socket");
            });
        };
        StartListener();
    }, [socket, lobby, setLobby, setInQueue, inQueue]);
    return ((0, jsx_runtime_1.jsx)(socket_context_1.SocketContextProvider, Object.assign({ value: { SocketState, SocketDispatch } }, { children: children })));
};
exports.default = SocketGameContextComponent;
