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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const user_api_1 = require("../api/user-api");
require("./leaderboard.css");
require("../style.css");
function Userlist() {
    const [userlist, setUserlist] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const fetchUserlist = () => __awaiter(this, void 0, void 0, function* () {
            yield (0, user_api_1.getUsers)()
                .then((res) => {
                setUserlist(res.data);
            })
                .catch((e) => {
                console.log("Error while fetching userlist", e);
            });
        });
        fetchUserlist();
    }, []);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleProfileClick = (event, id) => __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        navigate('/app/profile/' + id);
    });
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "container" }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__screen" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "profile__content " }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__top" }, { children: "1v1 matches" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__bottom" }, { children: (0, jsx_runtime_1.jsx)("table", { children: (0, jsx_runtime_1.jsxs)("tbody", { children: [(0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "rank" }), (0, jsx_runtime_1.jsx)("th", { children: "MMR" }), (0, jsx_runtime_1.jsx)("th", { children: "player" })] }), userlist.map((n, index) => ((0, jsx_runtime_1.jsxs)("tr", Object.assign({ className: "lb__clickable__line", onClick: event => handleProfileClick(event, n.id) }, { children: [(0, jsx_runtime_1.jsx)("td", { children: index + 1 }), (0, jsx_runtime_1.jsx)("td", { children: n.mmr }), (0, jsx_runtime_1.jsx)("td", { children: n.nickname })] }), n.id)))] }) }) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__top" }, { children: "battle royale" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "profile__panel__bottom" }, { children: "todo" }))] })) })) })) }));
}
exports.default = Userlist;
