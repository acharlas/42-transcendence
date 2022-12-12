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
// import { FaRocket } from "react-icons/fa";
const user_api_1 = require("../api/user-api");
const friend_api_1 = require("../api/friend-api");
const block_api_1 = require("../api/block-api");
const avatar_component_1 = __importDefault(require("../avatar/avatar_component"));
require("../style.css");
require("./profile.css");
const bandeau_1 = __importDefault(require("../bandeau/bandeau"));
//preliminary checks before using the display component
function Profile() {
    // State
    var { id } = (0, react_router_dom_1.useParams)();
    const [userData, setUserData] = (0, react_1.useState)({
        nickname: "",
        wins: 0,
        losses: 0,
        mmr: 0,
    });
    const [isFriend, setIsFriend] = (0, react_1.useState)(false);
    const [isBlocked, setIsBlocked] = (0, react_1.useState)(false);
    //useEffect once to get user data and friend/block initial status
    (0, react_1.useEffect)(() => {
        const fetchUserData = () => __awaiter(this, void 0, void 0, function* () {
            yield (0, user_api_1.getUser)({ id })
                .then((res) => {
                setUserData(res.data);
            })
                .catch((e) => {
                if (e.response.data.message === "no such user") {
                    console.log("no such user");
                    goHome();
                    return;
                }
            });
        });
        const fetchFriendBlockStates = () => __awaiter(this, void 0, void 0, function* () {
            yield (0, friend_api_1.checkIfFriend)({ id: id })
                .then((res) => {
                setIsFriend(res);
            })
                .catch((e) => {
                console.log("checkIfFriend err: " + e);
            });
            yield (0, block_api_1.checkIfBlocked)({ id: id })
                .then((res) => {
                setIsBlocked(res);
            })
                .catch((e) => {
                console.log("checkIfBlocked err: " + e);
            });
        });
        fetchUserData();
        fetchFriendBlockStates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    // Navigation
    const navigate = (0, react_router_dom_1.useNavigate)();
    const goHome = () => {
        navigate("/app");
    };
    // Utils
    const isSelfProfile = () => {
        return id === sessionStorage.getItem("userid");
    };
    // Events
    const friendClick = (event) => __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        try {
            if (isFriend) {
                yield (0, friend_api_1.removeFriend)({ id: id });
                setIsFriend(false);
            }
            else {
                yield (0, friend_api_1.addFriend)({ id: id });
                setIsFriend(true);
            }
        }
        catch (e) {
            console.log("Failed friend event.", e);
            //TODO: improve error
        }
    });
    const blockClick = (event) => __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        try {
            if (isBlocked) {
                yield (0, block_api_1.removeBlock)({ id: id });
                setIsBlocked(false);
            }
            else {
                yield (0, block_api_1.addBlock)({ id: id });
                setIsBlocked(true);
            }
        }
        catch (e) {
            console.log("Failed block event.", e);
            //TODO: improve error
        }
    });
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "container" }, { children: [(0, jsx_runtime_1.jsx)(bandeau_1.default, {}), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__screen" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "profile__content " }, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__top" }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__nickname" }, { children: userData.nickname })) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__bottom" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "profile__avatar__container" }, { children: [(0, avatar_component_1.default)(id), isSelfProfile() || ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "profile__button__container" }, { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ className: "profile__button", onClick: friendClick }, { children: isFriend ? "UNFRIEND" : "FRIEND" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "profile__button", onClick: blockClick }, { children: isBlocked ? "UNBLOCK" : "BLOCK" }))] })))] })) }))] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "profile__stats__container" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "profile__stats__unit" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__top" }, { children: "WINS" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__bottom" }, { children: userData.wins }))] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "profile__stats__unit" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__top" }, { children: "LOSSES" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__bottom" }, { children: userData.losses }))] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "profile__stats__unit" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__top" }, { children: "MMR" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__bottom" }, { children: userData.mmr }))] }))] })), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__top" }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__title" }, { children: "MATCH HISTORY" })) })), (0, jsx_runtime_1.jsx)("table", Object.assign({ className: "profile__panel__bottom profile__hist__table" }, { children: (0, jsx_runtime_1.jsxs)("tbody", { children: [(0, jsx_runtime_1.jsxs)("tr", Object.assign({ className: "profile__hist__head" }, { children: [(0, jsx_runtime_1.jsx)("th", { children: "W/L" }), (0, jsx_runtime_1.jsx)("th", { children: "SCORE" }), (0, jsx_runtime_1.jsx)("th", { children: "MODE" })] })), (0, jsx_runtime_1.jsxs)("tr", Object.assign({ className: "profile__hist__w" }, { children: [(0, jsx_runtime_1.jsx)("th", { children: "W" }), (0, jsx_runtime_1.jsx)("th", { children: "10-8" }), (0, jsx_runtime_1.jsx)("th", { children: "classic" })] })), (0, jsx_runtime_1.jsxs)("tr", Object.assign({ className: "profile__hist__l" }, { children: [(0, jsx_runtime_1.jsx)("th", { children: "L" }), (0, jsx_runtime_1.jsx)("th", { children: "3-10" }), (0, jsx_runtime_1.jsx)("th", { children: "classic" })] })), (0, jsx_runtime_1.jsxs)("tr", Object.assign({ className: "profile__hist__l" }, { children: [(0, jsx_runtime_1.jsx)("th", { children: "L" }), (0, jsx_runtime_1.jsx)("th", { children: "6-10" }), (0, jsx_runtime_1.jsx)("th", { children: "classic" })] })), (0, jsx_runtime_1.jsxs)("tr", Object.assign({ className: "profile__hist__w" }, { children: [(0, jsx_runtime_1.jsx)("th", { children: "W" }), (0, jsx_runtime_1.jsx)("th", { children: "10-9" }), (0, jsx_runtime_1.jsx)("th", { children: "classic" })] })), (0, jsx_runtime_1.jsxs)("tr", Object.assign({ className: "profile__hist__l" }, { children: [(0, jsx_runtime_1.jsx)("th", { children: "L" }), (0, jsx_runtime_1.jsx)("th", { children: "3-10" }), (0, jsx_runtime_1.jsx)("th", { children: "classic" })] })), (0, jsx_runtime_1.jsxs)("tr", Object.assign({ className: "profile__hist__w" }, { children: [(0, jsx_runtime_1.jsx)("th", { children: "W" }), (0, jsx_runtime_1.jsx)("th", { children: "10-9" }), (0, jsx_runtime_1.jsx)("th", { children: "classic" })] })), (0, jsx_runtime_1.jsxs)("tr", Object.assign({ className: "profile__hist__w" }, { children: [(0, jsx_runtime_1.jsx)("th", { children: "W" }), (0, jsx_runtime_1.jsx)("th", { children: "10-8" }), (0, jsx_runtime_1.jsx)("th", { children: "classic" })] })), (0, jsx_runtime_1.jsxs)("tr", Object.assign({ className: "profile__hist__l" }, { children: [(0, jsx_runtime_1.jsx)("th", { children: "L" }), (0, jsx_runtime_1.jsx)("th", { children: "6-10" }), (0, jsx_runtime_1.jsx)("th", { children: "classic" })] }))] }) })), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__top" }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__title" }, { children: "ACHIEVEMENTS" })) })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "profile__panel__bottom profile__achiev__list" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__achiev profile__bubble" }, { children: "on a roll" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__achiev profile__bubble" }, { children: "close call" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__achiev profile__bubble" }, { children: "reverse sweep" }))] }))] })) }))] })) }));
}
exports.default = Profile;
