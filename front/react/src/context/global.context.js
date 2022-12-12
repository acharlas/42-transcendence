"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGlobalContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const GlobalContext = (0, react_1.createContext)({
    userid: "",
    setUserid: () => { },
    username: "",
    setUsername: () => { },
    nickname: "",
    setNickname: () => { },
    blocklist: [],
    setBlocklist: () => { },
    friendlist: [],
    setFriendlist: () => { },
});
function GlobalProvider(props) {
    const [userid, setUserid] = (0, react_1.useState)("");
    const [username, setUsername] = (0, react_1.useState)("");
    const [nickname, setNickname] = (0, react_1.useState)("");
    const [blocklist, setBlocklist] = (0, react_1.useState)([]);
    const [friendlist, setFriendlist] = (0, react_1.useState)([]);
    return ((0, jsx_runtime_1.jsx)(GlobalContext.Provider, Object.assign({ value: {
            userid, setUserid,
            username, setUsername,
            nickname, setNickname,
            blocklist, setBlocklist,
            friendlist, setFriendlist,
        } }, props)));
}
const useGlobalContext = () => (0, react_1.useContext)(GlobalContext);
exports.useGlobalContext = useGlobalContext;
exports.default = GlobalProvider;
