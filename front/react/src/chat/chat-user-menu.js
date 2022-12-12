"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const fa_1 = require("react-icons/fa");
const md_1 = require("react-icons/md");
const ai_1 = require("react-icons/ai");
const hi_1 = require("react-icons/hi");
const gi_1 = require("react-icons/gi");
const tb_1 = require("react-icons/tb");
const im_1 = require("react-icons/im");
const chat_context_1 = require("../context/chat.context");
const socket_context_1 = __importDefault(require("../context/socket.context"));
const type_1 = require("./type");
function UserMenu() {
    const { setSelectUser, selectUser, actChannel, user, setShowTimeSelector, friendList, bloquedList, rooms, closeChatBox, setNewRoom, } = (0, chat_context_1.useChat)();
    const { socket } = (0, react_1.useContext)(socket_context_1.default).SocketState;
    let navigate = (0, react_router_dom_1.useNavigate)();
    const banUser = () => {
        setShowTimeSelector(type_1.UserPrivilege.ban);
    };
    const MuteUser = () => {
        setShowTimeSelector(type_1.UserPrivilege.muted);
    };
    const handleAddFriend = () => {
        socket.emit("AddFriend", { newFriend: selectUser.username });
    };
    const handleBlockUser = () => {
        socket.emit("AddBlock", { newBlock: selectUser.username });
    };
    const AdminUser = () => {
        console.log("admin user");
        socket.emit("UpdateUserPrivilege", {
            roomId: actChannel,
            privilege: "admin",
            time: null,
            toModifie: selectUser.username,
        });
        setSelectUser(undefined);
    };
    const setToDefault = () => {
        console.log("set to default");
        socket.emit("UpdateUserPrivilege", {
            roomId: actChannel,
            privilege: "default",
            time: null,
            toModifie: selectUser.username,
        });
        setSelectUser(undefined);
    };
    const handleShowUserProfile = () => {
        navigate("/app/profile/" + selectUser.id);
    };
    const handleSendDm = () => {
        const chan = rooms.find((room) => {
            const u = room.user.find((usr) => {
                if (usr.username === window.sessionStorage.getItem("username"))
                    return true;
                return false;
            });
            const u2 = room.user.find((usr) => {
                if (usr.username === selectUser.username)
                    return true;
                return false;
            });
            if (room.channel.type === type_1.ChannelType.dm && u && u2)
                return true;
            return false;
        });
        if (!chan) {
            console.log("send dm creation: ", selectUser.username);
            socket.emit("Dm", { sendTo: selectUser.username });
            return;
        }
        console.log("chan found: ", chan);
        closeChatBox();
        setNewRoom(chan);
    };
    if (user.username === selectUser.username)
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleShowUserProfile, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(fa_1.FaUserAstronaut, { className: "chat-box-button-icon" }) })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleSendDm, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(hi_1.HiMail, { className: "chat-box-button-icon" }) })), !friendList.find((user) => {
                if (selectUser.username === user.username)
                    return true;
                return false;
            }) ? ((0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleAddFriend, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(ai_1.AiFillHeart, { className: "chat-box-button-icon" }) }))) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), !bloquedList.find((user) => {
                if (selectUser.username === user.username)
                    return true;
                return false;
            }) ? ((0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleBlockUser, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(im_1.ImUserMinus, { className: "chat-box-button-icon" }) }))) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), user.privilege !== "admin" && user.privilege !== "owner" ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [selectUser.privilege === "admin" && user.privilege === "owner" ? ((0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: setToDefault, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(md_1.MdRemoveModerator, { className: "chat-box-button-icon" }) }))) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), selectUser.privilege !== "owner" &&
                        selectUser.privilege !== "admin" ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: AdminUser, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(md_1.MdAddModerator, { className: "chat-box-button-icon" }) })), selectUser.privilege === type_1.UserPrivilege.muted ? ((0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: setToDefault, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(tb_1.TbMessage, { className: "chat-box-button-icon" }) }))) : ((0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: MuteUser, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(tb_1.TbMessageOff, { className: "chat-box-button-icon" }) }))), selectUser.privilege === type_1.UserPrivilege.ban ? ((0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: setToDefault, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(ai_1.AiFillUnlock, { className: "chat-box-button-icon" }) }))) : ((0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: banUser, className: "chat-box-button" }, { children: (0, jsx_runtime_1.jsx)(gi_1.GiPrisoner, { className: "chat-box-button-icon" }) })))] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }))] }));
}
exports.default = UserMenu;
