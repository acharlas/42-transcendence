"use strict";
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
exports.SignupForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const fa_1 = require("react-icons/fa");
require("./login_style.css");
require("../style.css");
const displayErrMsgs_1 = __importDefault(require("../utils/displayErrMsgs"));
const auth_api_1 = require("../api/auth-api");
function SignupForm() {
    const [newPass, setNewPass] = (0, react_1.useState)("");
    const [newUsername, setNewUsername] = (0, react_1.useState)("");
    const [errorMessage, setErrorMessage] = (0, react_1.useState)("");
    const [hidePassword, setHidePassword] = (0, react_1.useState)(true);
    let navigate = (0, react_router_dom_1.useNavigate)();
    sessionStorage.clear();
    const HandlePassChange = (event) => {
        setNewPass(event.target.value);
    };
    const HandleUsernameChange = (event) => {
        setNewUsername(event.target.value);
    };
    const goSignin = () => {
        navigate("/");
    };
    const goHome = () => {
        navigate("/app");
    };
    const ftShowPassword = (event) => {
        event.preventDefault();
        setHidePassword(!hidePassword);
    };
    const createUser = (event) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        event.preventDefault();
        try {
            setErrorMessage("");
            const token = yield (0, auth_api_1.signup)({
                password: newPass,
                username: newUsername,
            });
            console.log({ token });
            window.sessionStorage.setItem("Token", token);
            setNewPass("");
            setNewUsername("");
            goHome();
        }
        catch (e) {
            console.log({ e });
            setErrorMessage((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message);
        }
    });
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "login__container" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "login__screen" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "login__screen__content" }, { children: (0, jsx_runtime_1.jsxs)("form", Object.assign({ className: "login__signup" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "login__field" }, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaUserAstronaut, {}), (0, jsx_runtime_1.jsx)("input", { className: "login__input", placeholder: "Username", value: newUsername, onChange: HandleUsernameChange })] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "login__field" }, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaLock, {}), (0, jsx_runtime_1.jsx)("input", { className: "login__input", placeholder: "Password", value: newPass, type: hidePassword ? "password" : "text", onChange: HandlePassChange }), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "login__input___show-button", onClick: ftShowPassword }, { children: hidePassword ? (0, jsx_runtime_1.jsx)(fa_1.FaEye, {}) : (0, jsx_runtime_1.jsx)(fa_1.FaEyeSlash, {}) }))] })), (0, displayErrMsgs_1.default)(errorMessage), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "button login__buttons", onClick: createUser }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: "button__text" }, { children: "Create account" })), (0, jsx_runtime_1.jsx)(fa_1.FaRocket, { className: "login__icon" })] })), (0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "button login__buttons", onClick: goSignin }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: "button__text" }, { children: "Login instead?" })), (0, jsx_runtime_1.jsx)(fa_1.FaSpaceShuttle, { className: "login__icon" })] }))] })] })) })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "screen__background" }, { children: [(0, jsx_runtime_1.jsx)("span", { className: "screen__background__shape screen__background__shape4" }), (0, jsx_runtime_1.jsx)("span", { className: "screen__background__shape screen__background__shape3" }), (0, jsx_runtime_1.jsx)("span", { className: "screen__background__shape screen__background__shape2" }), (0, jsx_runtime_1.jsx)("span", { className: "screen__background__shape screen__background__shape1" })] }))] })) })));
}
exports.SignupForm = SignupForm;
