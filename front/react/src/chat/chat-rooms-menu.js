"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const fa_1 = require("react-icons/fa");
const gi_1 = require("react-icons/gi");
const tb_1 = require("react-icons/tb");
const ri_1 = require("react-icons/ri");
const chat_context_1 = require("../context/chat.context");
const io_1 = require("react-icons/io");
const ai_1 = require("react-icons/ai");
const md_1 = require("react-icons/md");
const type_1 = require("./type");
const si_1 = require("react-icons/si");
const socket_context_1 = __importDefault(require("../context/socket.context"));
const hi_1 = require("react-icons/hi");
const bi_1 = require("react-icons/bi");
function RoomsMenuContainer({ setShow }) {
    const [searchFriend, setSearchFriend] = (0, react_1.useState)("");
    const [newFriend, setNewFriend] = (0, react_1.useState)("");
    const [newBlock, setNewBlock] = (0, react_1.useState)("");
    const { socket } = (0, react_1.useContext)(socket_context_1.default).SocketState;
    const [searchChannel, setSearchChannel] = (0, react_1.useState)("");
    const { rooms, actChannel, showCreateMenu, setShowCreateMenu, setSelectUser, selectUser, user, showChannel, setShowChannel, setShowBloqued, showBloqued, showFriend, setShowFriend, friendList, bloquedList, setShowJoinMenu, showJoinMenu, setShowRoomSetting, showDm, setShowDm, closeChatBox, setNewRoom, FriendErrMsg, BlockErrMsg, setFriendErrMsg, setBlockErrMsg, resetErrMsg, } = (0, chat_context_1.useChat)();
    function handleJoinRoom(key) {
        console.log("try to join:", key);
        if (key === actChannel)
            return;
        closeChatBox();
        const curRoom = rooms.find((room) => {
            if (room.channel.id === key)
                return true;
            return false;
        });
        curRoom.newMessage = false;
        setNewRoom(curRoom);
        console.log("user set to: ", user);
    }
    const handleShowRoomMenu = (event) => {
        setShow(false);
    };
    const handleShowCreateRoom = (event) => {
        closeChatBox();
        setShowCreateMenu(true);
    };
    const handleJoinNewRoom = (event) => {
        closeChatBox();
        setShowJoinMenu(true);
    };
    const handleShowUser = (user) => {
        if (selectUser && selectUser.username === user.username)
            setSelectUser(undefined);
        else
            setSelectUser(user);
    };
    const handleSearchFriend = (event) => {
        setSearchFriend(event.target.value);
    };
    const handleSearchChannel = (event) => {
        setSearchChannel(event.target.value);
    };
    const handleShowChannel = (event) => {
        showChannel ? setShowChannel(false) : setShowChannel(true);
    };
    const handleShowRoomSetting = (room) => {
        closeChatBox();
        setShowRoomSetting(room);
        resetErrMsg();
    };
    const handleShowFriend = (event) => {
        showFriend ? setShowFriend(false) : setShowFriend(true);
        setFriendErrMsg("");
    };
    const handleShowBloqued = (event) => {
        showBloqued ? setShowBloqued(false) : setShowBloqued(true);
        setBlockErrMsg("");
    };
    const handleAddFriend = (event) => {
        event.preventDefault();
        console.log(newFriend);
        socket.emit("AddFriend", { newFriend });
    };
    const handleAddBlock = (event) => {
        event.preventDefault();
        console.log(newBlock);
        socket.emit("AddBlock", { newBlock });
    };
    const handleChangeNewFriend = (event) => {
        setNewFriend(event.target.value);
    };
    const handleChangeNewBlock = (event) => {
        setNewBlock(event.target.value);
    };
    const handleRemoveFriend = (username) => {
        socket.emit("RemoveFriend", { username });
    };
    const handleRemoveBlock = (username) => {
        socket.emit("RemoveBlock", { username });
    };
    const handleLeaveChannel = (roomId) => {
        console.log("leave room: ", roomId);
        socket.emit("LeaveRoom", { roomId });
    };
    const handleShowDm = () => {
        showDm ? setShowDm(false) : setShowDm(true);
    };
    const handleSendDm = (username) => {
        const chan = rooms.find((room) => {
            const u = room.user.find((usr) => {
                if (usr.username === window.sessionStorage.getItem("username"))
                    return true;
                return false;
            });
            const u2 = room.user.find((usr) => {
                if (usr.username === username)
                    return true;
                return false;
            });
            if (room.channel.type === type_1.ChannelType.dm && u && u2)
                return true;
            return false;
        });
        if (!chan) {
            socket.emit("Dm", { sendTo: username });
            return;
        }
        closeChatBox();
        setNewRoom(chan);
    };
    function menuElemFriendlist() {
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("button", Object.assign({ onClick: handleShowFriend, className: "room-menu-button-scroll-menu" }, { children: ["Friendlist", " ", showFriend ? ((0, jsx_runtime_1.jsx)(ri_1.RiArrowDropUpFill, { className: "room-menu-button-scroll-menu-icon" })) : ((0, jsx_runtime_1.jsx)(ri_1.RiArrowDropDownFill, { className: "room-menu-button-scroll-menu-icon" }))] })), showFriend ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("form", { children: [(0, jsx_runtime_1.jsx)("input", { value: newFriend, onChange: handleChangeNewFriend, placeholder: "add new friend", className: "room-menu-input-search-block-friend" }), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleAddFriend, className: "room-menu-button-add-friend-block" }, { children: (0, jsx_runtime_1.jsx)(io_1.IoIosAddCircle, {}) }))] }), FriendErrMsg ? ((0, jsx_runtime_1.jsx)("p", Object.assign({ className: "room-chat-err-message" }, { children: FriendErrMsg }))) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsx)("ul", { children: friendList.map((friend, id) => {
                                if (!friend.nickname.search(newFriend)) {
                                    return ((0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: () => {
                                                    handleSendDm(friend.username);
                                                }, className: "room-menu-button-user-block-friend" }, { children: friend.nickname })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: () => {
                                                    handleRemoveFriend(friend.username);
                                                }, className: "room-menu-button-remove-user" }, { children: (0, jsx_runtime_1.jsx)(md_1.MdPersonRemove, {}) }))] }, id));
                                }
                                return null;
                            }) })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }));
    }
    function menuElemBlocklist() {
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("button", Object.assign({ onClick: handleShowBloqued, className: "room-menu-button-scroll-menu" }, { children: ["Blocklist", " ", showBloqued ? ((0, jsx_runtime_1.jsx)(ri_1.RiArrowDropUpFill, { className: "room-menu-button-scroll-menu-icon" })) : ((0, jsx_runtime_1.jsx)(ri_1.RiArrowDropDownFill, { className: "room-menu-button-scroll-menu-icon" }))] })), showBloqued ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("form", { children: [(0, jsx_runtime_1.jsx)("input", { value: newBlock, onChange: handleChangeNewBlock, placeholder: "ignore someone", className: "room-menu-input-search-block-friend" }), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: handleAddBlock, className: "room-menu-button-add-friend-block" }, { children: (0, jsx_runtime_1.jsx)(io_1.IoIosAddCircle, {}) }))] }), BlockErrMsg ? ((0, jsx_runtime_1.jsx)("p", Object.assign({ className: "room-chat-err-message" }, { children: BlockErrMsg }))) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsx)("ul", { children: bloquedList.map((block, id) => {
                                if (!block.nickname.search(newBlock)) {
                                    return ((0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ className: "room-menu-button-user-block-friend" }, { children: block.nickname })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: () => {
                                                    handleRemoveBlock(block.username);
                                                }, className: "room-menu-button-remove-user" }, { children: (0, jsx_runtime_1.jsx)(md_1.MdPersonRemove, {}) }))] }, id));
                                }
                                return null;
                            }) })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }));
    }
    function menuElemChannels() {
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("button", Object.assign({ onClick: handleShowChannel, className: "room-menu-button-scroll-menu" }, { children: ["Channels", " ", rooms.find((room) => {
                            if (room.channel.type !== type_1.ChannelType.dm && room.newMessage)
                                return true;
                            return false;
                        }) && (0, jsx_runtime_1.jsx)(bi_1.BiMessageAltAdd, {}), showChannel ? ((0, jsx_runtime_1.jsx)(ri_1.RiArrowDropUpFill, { className: "room-menu-button-scroll-menu-icon" })) : ((0, jsx_runtime_1.jsx)(ri_1.RiArrowDropDownFill, { className: "room-menu-button-scroll-menu-icon" }))] })), showChannel ? ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "room-menu-room-list-container" }, { children: [(0, jsx_runtime_1.jsx)("input", { value: searchChannel, onChange: handleSearchChannel, placeholder: "looking for channel?", className: "room-menu-input-channel" }), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "room-menu-button-create-join", onClick: handleShowCreateRoom, disabled: actChannel === null && showCreateMenu }, { children: "create" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "room-menu-button-create-join", onClick: handleJoinNewRoom, disabled: actChannel === null && showJoinMenu === true }, { children: "join" })), rooms ? (rooms.map((room, id) => {
                            if (room.channel.type === type_1.ChannelType.dm)
                                return null;
                            const channel = room.channel;
                            const chanUser = room.user.find((chanUser) => {
                                if (chanUser.username ===
                                    window.sessionStorage.getItem("username"))
                                    return true;
                                return false;
                            });
                            if (!room.channel.name.search(searchChannel))
                                return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "room-menu-button-join-room", disabled: channel.id === actChannel ||
                                                (user && user.privilege === type_1.UserPrivilege.ban), title: `Join ${channel.name}`, onClick: () => handleJoinRoom(channel.id) }, { children: [channel.type === type_1.ChannelType.protected ? ((0, jsx_runtime_1.jsx)(fa_1.FaLock, {})) : (""), channel.name, room.newMessage && (0, jsx_runtime_1.jsx)(bi_1.BiMessageAltAdd, {})] })), chanUser.privilege === type_1.UserPrivilege.owner ? ((0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: () => {
                                                handleShowRoomSetting(room);
                                            } }, { children: (0, jsx_runtime_1.jsx)(ai_1.AiFillSetting, {}) }))) : ((0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: () => {
                                                handleLeaveChannel(room.channel.id);
                                            } }, { children: (0, jsx_runtime_1.jsx)(hi_1.HiXCircle, {}) }))), room.channel.id === actChannel ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("input", { value: searchFriend, onChange: handleSearchFriend, placeholder: "looking for friend?", className: "room-menu-input-friend" }), (0, jsx_runtime_1.jsx)("ul", { children: room.user.map((actUser, id) => {
                                                        //searchFriend.current.value = "";
                                                        if (!actUser.nickname.search(searchFriend) &&
                                                            ((actUser.status !== type_1.UserStatus.invited &&
                                                                actUser.status !== type_1.UserStatus.disconnected) ||
                                                                actUser.privilege === type_1.UserPrivilege.ban))
                                                            return ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "room-menu-button-user", onClick: () => {
                                                                        handleShowUser(actUser);
                                                                    }, disabled: user.username === actUser.username }, { children: [actUser.privilege ===
                                                                            type_1.UserPrivilege.admin && ((0, jsx_runtime_1.jsx)(gi_1.GiAlienStare, { className: "room-menu-user-icon" })), actUser.privilege ===
                                                                            type_1.UserPrivilege.owner && ((0, jsx_runtime_1.jsx)(si_1.SiStarship, { className: "room-menu-user-icon" })), actUser.privilege ===
                                                                            type_1.UserPrivilege.ban && ((0, jsx_runtime_1.jsx)(fa_1.FaBan, { className: "room-menu-user-icon" })), actUser.privilege ===
                                                                            type_1.UserPrivilege.muted && ((0, jsx_runtime_1.jsx)(tb_1.TbMessageCircleOff, { className: "room-menu-user-icon" })), actUser.privilege ===
                                                                            type_1.UserPrivilege.default && ((0, jsx_runtime_1.jsx)(gi_1.GiAstronautHelmet, { className: "room-menu-user-icon" })), actUser.nickname] })) }, id));
                                                        return null;
                                                    }) })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }, id));
                            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
                        })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }))) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }));
    }
    function menuElemMessages() {
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("button", Object.assign({ onClick: handleShowDm, className: "room-menu-button-scroll-menu" }, { children: ["Private Messages", " ", rooms.find((room) => {
                            if (room.channel.type === type_1.ChannelType.dm && room.newMessage)
                                return true;
                            return false;
                        }) && (0, jsx_runtime_1.jsx)(bi_1.BiMessageAltAdd, {}), showDm ? ((0, jsx_runtime_1.jsx)(ri_1.RiArrowDropUpFill, { className: "room-menu-button-scroll-menu-icon" })) : ((0, jsx_runtime_1.jsx)(ri_1.RiArrowDropDownFill, { className: "room-menu-button-scroll-menu-icon" }))] })), showDm ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: rooms.map((room, id) => {
                        const usr = room.user.find((usr) => {
                            if (usr.username !== window.sessionStorage.getItem("username"))
                                return true;
                            return false;
                        });
                        if (room.channel.type !== type_1.ChannelType.dm ||
                            bloquedList.find((block) => {
                                if (block.username === usr.username)
                                    return true;
                                return false;
                            }))
                            return null;
                        return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("button", Object.assign({ title: `Join ${room.channel.name}`, onClick: () => handleJoinRoom(room.channel.id), className: "room-menu-button-dm", disabled: room.channel.id === actChannel }, { children: [room.user.find((usr) => {
                                        if (usr.username !==
                                            window.sessionStorage.getItem("username"))
                                            return true;
                                        return false;
                                    }).username, room.newMessage && (0, jsx_runtime_1.jsx)(bi_1.BiMessageAltAdd, {})] })) }, id));
                    }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }));
    }
    return ((0, jsx_runtime_1.jsxs)("nav", Object.assign({ className: "room-menu" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "room-menu-search-channel-container" }, { children: (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "room-menu-close-button", onClick: handleShowRoomMenu }, { children: (0, jsx_runtime_1.jsx)(hi_1.HiXCircle, {}) })) })), menuElemFriendlist(), menuElemBlocklist(), menuElemChannels(), menuElemMessages()] })));
}
exports.default = RoomsMenuContainer;
