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
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const fa_1 = require("react-icons/fa");
require("./login_style.css");
require("../style.css");
const displayErrMsgs_1 = __importDefault(require("../utils/displayErrMsgs"));
const auth_api_1 = require("../api/auth-api");
const SigninForm = (props) => {
    const [newUsername, setNewUsername] = (0, react_1.useState)("");
    const [newPass, setNewPass] = (0, react_1.useState)("");
    const [errorMessage, setErrorMessage] = (0, react_1.useState)("");
    const [hidePassword, setHidePassword] = (0, react_1.useState)(true);
    let navigate = (0, react_router_dom_1.useNavigate)();
    sessionStorage.clear();
    const HandleUsernameChange = (event) => {
        setNewUsername(event.target.value);
    };
    const HandlePassChange = (event) => {
        setNewPass(event.target.value);
    };
    const goSignup = () => {
        navigate("/signup");
    };
    const goHome = () => {
        navigate("/app");
    };
    const goSigninMfa = () => {
        navigate("/mfa-signin");
    };
    const ftShowPassword = (event) => {
        event.preventDefault();
        setHidePassword(!hidePassword);
    };
    const signinClassic = (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        try {
            setErrorMessage("");
            const token = yield (0, auth_api_1.signin)({
                username: newUsername,
                password: newPass,
            });
            window.sessionStorage.setItem("Token", token);
            setNewUsername("");
            setNewPass("");
            const tokenInfo = (0, jwt_decode_1.default)(token); //can throw InvalidTokenError
            if (tokenInfo.fullyAuth) {
                goHome();
            }
            else {
                goSigninMfa();
            }
        }
        catch (e) {
            setErrorMessage("wrong username or password");
        }
    });
    function fortyTwoOauthUrl() {
        let url = `https://api.intra.42.fr/oauth/authorize
?client_id=${process.env.REACT_APP_42API_UID}
&redirect_uri=${encodeURI(process.env.REACT_APP_42API_REDIRECT)}
&response_type=code
&state=`;
        let secretState = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const stringLength = Math.floor(Math.random() * 200 + 200);
        for (let i = 0; i < stringLength; i++) {
            secretState += possible.at(Math.floor(Math.random() * possible.length));
        }
        return url + secretState;
    }
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "login__container" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "login__screen" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "login__screen__content" }, { children: (0, jsx_runtime_1.jsxs)("form", Object.assign({ className: "login" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "login__field" }, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaUserAstronaut, {}), (0, jsx_runtime_1.jsx)("input", { className: "login__input", placeholder: "username", value: newUsername, onChange: HandleUsernameChange })] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "login__field" }, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaLock, {}), (0, jsx_runtime_1.jsx)("input", { className: "login__input", placeholder: "Password", value: newPass, type: hidePassword ? "password" : "text", onChange: HandlePassChange }), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "login__input___show-button", onClick: ftShowPassword }, { children: hidePassword ? (0, jsx_runtime_1.jsx)(fa_1.FaEye, {}) : (0, jsx_runtime_1.jsx)(fa_1.FaEyeSlash, {}) }))] })), (0, displayErrMsgs_1.default)(errorMessage), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "button login__buttons", onClick: signinClassic }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: "button__text" }, { children: "Log In Now" })), (0, jsx_runtime_1.jsx)(fa_1.FaRocket, { className: "login__icon" })] })), (0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "button login__buttons", onClick: goSignup }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: "button__text" }, { children: "Signup Now" })), (0, jsx_runtime_1.jsx)(fa_1.FaSpaceShuttle, { className: "login__icon" })] })), (0, jsx_runtime_1.jsxs)("a", Object.assign({ className: "button login__buttons", href: fortyTwoOauthUrl() }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: "button__text" }, { children: "Oauth 42" })), (0, jsx_runtime_1.jsx)(fa_1.FaFighterJet, { className: "login__icon" })] }))] })] })) })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "screen__background" }, { children: [(0, jsx_runtime_1.jsx)("span", { className: "screen__background__shape screen__background__shape4" }), (0, jsx_runtime_1.jsx)("span", { className: "screen__background__shape screen__background__shape3" }), (0, jsx_runtime_1.jsx)("span", { className: "screen__background__shape screen__background__shape2" }), (0, jsx_runtime_1.jsx)("span", { className: "screen__background__shape screen__background__shape1" })] }))] })) })));
};
exports.default = SigninForm;
