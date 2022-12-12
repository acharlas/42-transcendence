"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const fa_1 = require("react-icons/fa");
const bs_1 = require("react-icons/bs");
const im_1 = require("react-icons/im");
const user_api_1 = require("../api/user-api");
const mfa_api_1 = require("../api/mfa-api");
const block_api_1 = require("../api/block-api");
const friend_api_1 = require("../api/friend-api");
const avatar_api_1 = require("../api/avatar-api");
const mfa_status_1 = require("./constants/mfa-status");
const avatar_status_1 = require("./constants/avatar-status");
const default_avatar_component_1 = __importDefault(require("../avatar/default_avatar_component"));
const reload_avatar_component_1 = __importDefault(require("../avatar/reload_avatar_component"));
require("../style.css");
require("../profile/profile.css");
require("./settings.css");
function Profile() {
    //utils
    const navigate = (0, react_router_dom_1.useNavigate)();
    const goSignIn = () => {
        navigate("/");
    };
    function displayError(msg) {
        return (0, jsx_runtime_1.jsx)("p", Object.assign({ className: "error-msg" }, { children: msg }));
    }
    // State variables
    const [nickname, setNickname] = (0, react_1.useState)("");
    const [newNickname, setNewNickname] = (0, react_1.useState)("");
    const [editingNickname, setEditingNickname] = (0, react_1.useState)(false);
    const [blocklist, setBlocklist] = (0, react_1.useState)([]);
    const [friendlist, setFriendlist] = (0, react_1.useState)([]);
    const [mfaStatus, setMfaStatus] = (0, react_1.useState)(mfa_status_1.MfaStatus.LOADING);
    const [avatarStatus, setAvatarStatus] = (0, react_1.useState)(avatar_status_1.AvatarStatus.LOADING);
    const [avatarToUpload, setAvatarToUpload] = (0, react_1.useState)(null);
    const [avatarReload, setAvatarReload] = (0, react_1.useState)(0);
    const [smsCode, setSmsCode] = (0, react_1.useState)("");
    const [phoneNumber, setPhoneNumber] = (0, react_1.useState)("");
    const [avatarError, setAvatarError] = (0, react_1.useState)("");
    const [mfaError, setMfaError] = (0, react_1.useState)("");
    const [nicknameError, setNicknameError] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        const fetchUserData = () => __awaiter(this, void 0, void 0, function* () {
            yield (0, user_api_1.getUsersMe)()
                .then((res) => {
                setNickname(res.data.nickname);
                setMfaStatus(res.data.mfaEnabled ? mfa_status_1.MfaStatus.ENABLED : mfa_status_1.MfaStatus.DISABLED);
            })
                .catch((e) => {
                console.log("Settings: Error in fetchUserData", e);
                // redirect to auth page if auth failed
                if (e.response.status === 401) {
                    goSignIn();
                }
            });
        });
        const fetchBlocklist = () => __awaiter(this, void 0, void 0, function* () {
            yield (0, block_api_1.getBlock)({ id: window.sessionStorage.getItem("userid") })
                .then((res) => {
                setBlocklist(res.data.myblock);
            })
                .catch((e) => {
                console.log("Error while fetching blocklist", e);
            });
        });
        const fetchFriendlist = () => __awaiter(this, void 0, void 0, function* () {
            yield (0, friend_api_1.getFriend)({ id: window.sessionStorage.getItem("userid") })
                .then((res) => {
                setFriendlist(res.data.myfriend);
            })
                .catch((e) => {
                console.log("Error while fetching friendlist", e);
            });
        });
        fetchUserData();
        fetchBlocklist();
        fetchFriendlist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //AVATAR
    const uploadAvatar = (event) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        event.preventDefault();
        if (avatarToUpload) {
            setAvatarError("");
            try {
                yield (0, avatar_api_1.postAvatar)(avatarToUpload);
                setAvatarStatus(avatar_status_1.AvatarStatus.UPLOADED);
                setTimeout(() => {
                    setAvatarReload(avatarReload + 1);
                }, 100);
            }
            catch (e) {
                setAvatarError((_b = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message);
                console.log("failed to upload avatar");
            }
        }
        else {
            setAvatarError("please select a file to upload");
        }
    });
    const removeAvatar = (event) => __awaiter(this, void 0, void 0, function* () {
        var _c, _d;
        event.preventDefault();
        setAvatarError("");
        try {
            yield (0, avatar_api_1.deleteAvatar)();
            setAvatarStatus(avatar_status_1.AvatarStatus.DELETED);
        }
        catch (e) {
            setAvatarError((_d = (_c = e === null || e === void 0 ? void 0 : e.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message);
        }
    });
    function selectFile(event) {
        setAvatarToUpload(event.target.files[0]);
    }
    function avatarSettings() {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__top" }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__title" }, { children: "Avatar" })) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__bottom profile__panel__avatar" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "settings__avatar__div" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "settings__avatar__container" }, { children: avatarStatus === avatar_status_1.AvatarStatus.DELETED
                                    ? (0, default_avatar_component_1.default)("settings__avatar")
                                    : (0, reload_avatar_component_1.default)(window.sessionStorage.getItem("userid"), avatarReload, "settings__avatar") })), (0, jsx_runtime_1.jsx)("input", { type: "file", onChange: selectFile }), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "settings__button__texticon", onClick: uploadAvatar }, { children: "Upload a new avatar" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "settings__button__texticon", onClick: removeAvatar }, { children: "Delete current avatar" })), displayError(avatarError)] })) }))] }));
    }
    // NICKNAME
    const editNickname = (event) => __awaiter(this, void 0, void 0, function* () {
        var _e, _f;
        event.preventDefault();
        setNicknameError("");
        try {
            yield (0, user_api_1.patchNickname)({ nickname: newNickname });
            setEditingNickname(false);
            setNickname(newNickname);
            setNewNickname("");
        }
        catch (e) {
            setNicknameError((_f = (_e = e === null || e === void 0 ? void 0 : e.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message);
        }
    });
    const startEditingNickname = (event) => __awaiter(this, void 0, void 0, function* () {
        setEditingNickname(true);
    });
    const stopEditingNickname = (event) => __awaiter(this, void 0, void 0, function* () {
        setEditingNickname(false);
        setNewNickname("");
    });
    const handleNewNicknameChange = (event) => __awaiter(this, void 0, void 0, function* () {
        setNewNickname(event.target.value);
    });
    const HandleSmsCodeChange = (event) => {
        setSmsCode(event.target.value);
    };
    function nicknameSettings() {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__top" }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__title" }, { children: "Nickname" })) })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "profile__panel__bottom" }, { children: [editingNickname ? ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "settings__line" }, { children: [(0, jsx_runtime_1.jsx)("input", { className: "settings__line__elem settings__nickname__input", placeholder: "new nickname", value: newNickname, onChange: handleNewNicknameChange, type: "text" }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "settings__line__elem settings__group__two__buttons" }, { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ className: "settings__button__texticon", onClick: editNickname }, { children: (0, jsx_runtime_1.jsx)(im_1.ImCheckmark, { className: "settings__icon" }) })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "settings__button__texticon", onClick: stopEditingNickname }, { children: (0, jsx_runtime_1.jsx)(im_1.ImCross, { className: "settings__icon" }) }))] }))] }))) : ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "settings__line" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "settings__line__elem" }, { children: nickname })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "settings__line__elem settings__button__texticon", onClick: startEditingNickname }, { children: (0, jsx_runtime_1.jsx)(fa_1.FaPen, { className: "settings__icon" }) }))] }))), displayError(nicknameError)] }))] }));
    }
    // MFA
    const beginFlow = (event) => __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        setMfaError("");
        setMfaStatus(mfa_status_1.MfaStatus.INIT);
    });
    const sendCode = (event) => __awaiter(this, void 0, void 0, function* () {
        var _g, _h;
        event.preventDefault();
        setMfaError("");
        try {
            yield (0, mfa_api_1.requestMfaSetupInit)({ phoneNumber: phoneNumber });
            setMfaStatus(mfa_status_1.MfaStatus.VALIDATE);
        }
        catch (e) {
            setMfaError((_h = (_g = e === null || e === void 0 ? void 0 : e.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.message);
        }
    });
    const validateCode = (event) => __awaiter(this, void 0, void 0, function* () {
        var _j, _k;
        event.preventDefault();
        setMfaError("");
        try {
            yield (0, mfa_api_1.requestMfaSetupFinish)({ codeToCheck: smsCode });
            setSmsCode("");
            setMfaStatus(mfa_status_1.MfaStatus.ENABLED);
        }
        catch (e) {
            console.log("Settings: error in validateCode", e);
            setMfaError((_k = (_j = e === null || e === void 0 ? void 0 : e.response) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.message);
        }
    });
    const disable = (event) => __awaiter(this, void 0, void 0, function* () {
        var _l, _m;
        event.preventDefault();
        setMfaError("");
        try {
            const response = yield (0, mfa_api_1.requestMfaDisable)();
            if (response.status === 204) {
                setMfaStatus(mfa_status_1.MfaStatus.DISABLED);
            }
            else {
                setMfaError("Disabling mfa failed.");
            }
        }
        catch (e) {
            setMfaError((_m = (_l = e === null || e === void 0 ? void 0 : e.response) === null || _l === void 0 ? void 0 : _l.data) === null || _m === void 0 ? void 0 : _m.message);
        }
    });
    const cancelInit = (event) => __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        setMfaError("");
        setPhoneNumber("");
        setMfaStatus(mfa_status_1.MfaStatus.DISABLED);
    });
    const cancelValidate = (event) => __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        setMfaError("");
        setSmsCode("");
        setMfaStatus(mfa_status_1.MfaStatus.INIT);
    });
    const HandlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };
    function mfaSettings() {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__top" }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__title" }, { children: "Two-factor authentication" })) })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "profile__panel__bottom" }, { children: [mfaStatus === mfa_status_1.MfaStatus.ENABLED && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "settings__line" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "settings__line__elem" }, { children: "2FA is enabled" })), (0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "settings__button__texticon", onClick: disable }, { children: ["disable", (0, jsx_runtime_1.jsx)(bs_1.BsShieldFillMinus, { className: "settings__icon" })] }))] })) })), mfaStatus === mfa_status_1.MfaStatus.DISABLED && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "settings__line" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "settings__line__elem" }, { children: "2FA is disabled" })), (0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "settings__button__texticon", onClick: beginFlow }, { children: ["enable", (0, jsx_runtime_1.jsx)(bs_1.BsShieldFillPlus, { className: "settings__icon" })] }))] })) })), mfaStatus === mfa_status_1.MfaStatus.INIT && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Enter a phone number (international format) to use for 2FA.", (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "settings__line" }, { children: [(0, jsx_runtime_1.jsx)("input", { className: "settings__line__elem settings__nickname__input", placeholder: "+XX XXXXXXXXX", value: phoneNumber, onChange: HandlePhoneNumberChange }), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "settings__button__texticon", onClick: sendCode }, { children: (0, jsx_runtime_1.jsx)(im_1.ImCheckmark, { className: "settings__icon" }) })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "settings__button__texticon", onClick: cancelInit }, { children: (0, jsx_runtime_1.jsx)(im_1.ImCross, { className: "settings__icon" }) }))] }))] })), mfaStatus === mfa_status_1.MfaStatus.VALIDATE && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Enter the code you should have received to ", phoneNumber, ".", (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "settings__line" }, { children: [(0, jsx_runtime_1.jsx)("input", { className: "settings__line__elem settings__nickname__input", placeholder: "XXXXXX", value: smsCode, 
                                            //accept max. 6 digits
                                            maxLength: 6, onKeyPress: (event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }, onChange: HandleSmsCodeChange }), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "settings__button__texticon", onClick: validateCode }, { children: (0, jsx_runtime_1.jsx)(im_1.ImCheckmark, { className: "settings__icon" }) })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "settings__button__texticon", onClick: cancelValidate }, { children: (0, jsx_runtime_1.jsx)(im_1.ImCross, { className: "settings__icon" }) }))] }))] })), displayError(mfaError)] }))] }));
    }
    // FRIENDS
    function friendSettings() {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__top" }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__title" }, { children: "Friends" })) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__bottom" }, { children: (0, jsx_runtime_1.jsx)("table", { children: (0, jsx_runtime_1.jsx)("tbody", { children: friendlist.map((n, index) => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("a", Object.assign({ href: "/profile/" + n.id }, { children: n.nickname })) }), (0, jsx_runtime_1.jsx)("td", { children: "unfriend" })] }, n.nickname))) }) }) }))] }));
    }
    function blockSettings() {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__top" }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__title" }, { children: "Blocked users" })) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__bottom" }, { children: (0, jsx_runtime_1.jsx)("table", { children: (0, jsx_runtime_1.jsx)("tbody", { children: blocklist.map((n, index) => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("a", Object.assign({ href: "/profile/" + n.id }, { children: n.nickname })) }), (0, jsx_runtime_1.jsx)("td", { children: "unblock" })] }, n.nickname))) }) }) }))] }));
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "container" }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__screen" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "profile__content" }, { children: [avatarSettings(), (0, jsx_runtime_1.jsx)("br", {}), nicknameSettings(), (0, jsx_runtime_1.jsx)("br", {}), mfaSettings(), (0, jsx_runtime_1.jsx)("br", {}), friendSettings(), (0, jsx_runtime_1.jsx)("br", {}), blockSettings()] })) })) })) }));
}
exports.default = Profile;
