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
require("./login_style.css");
require("../style.css");
const displayErrMsgs_1 = __importDefault(require("../utils/displayErrMsgs"));
const mfa_api_1 = require("../api/mfa-api");
function MfaSignin() {
    let navigate = (0, react_router_dom_1.useNavigate)();
    const goHome = () => {
        navigate("/app");
    };
    const [smsCode, setSmsCode] = (0, react_1.useState)("");
    const [errorMessage, setErrorMessage] = (0, react_1.useState)("");
    const HandleSmsCodeChange = (event) => {
        setSmsCode(event.target.value);
    };
    const signinWithMfa = (params) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, mfa_api_1.requestMfaSigninFinish)(params);
            window.sessionStorage.setItem(`Token`, response.data.access_token);
            return response;
        }
        catch (e) {
            console.log(`Mfa error`, { e });
            return e;
        }
    });
    const sendSmsCode = (event) => __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        //TODO: countdown/modularity
        yield (0, mfa_api_1.requestMfaSigninInit)();
    });
    const checkSmsCode = (event) => __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        try {
            setErrorMessage("");
            yield signinWithMfa({ codeToCheck: smsCode });
            goHome();
        }
        catch (e) {
            console.log({ e });
            setErrorMessage("Incorrect code."); //TODO: improve error msg
        }
    });
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "login__container" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "login__screen" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "login__screen__content" }, { children: (0, jsx_runtime_1.jsxs)("form", Object.assign({ className: "login" }, { children: [(0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "login__buttons", onClick: sendSmsCode }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: "button__text" }, { children: "Send me a code" })), (0, jsx_runtime_1.jsx)(fa_1.FaRocket, { className: "login__icon" })] })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "authcode__field" }, { children: (0, jsx_runtime_1.jsx)("input", { className: "login__input", placeholder: "XXXXXX", value: smsCode, 
                                    //accept max. 6 digits
                                    maxLength: 6, onKeyPress: (event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }, onChange: HandleSmsCodeChange }) })), (0, displayErrMsgs_1.default)(errorMessage), (0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "login__buttons", onClick: checkSmsCode }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: "button__text" }, { children: "Check code" })), (0, jsx_runtime_1.jsx)(fa_1.FaRocket, { className: "login__icon" })] }))] })) })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "screen__background" }, { children: [(0, jsx_runtime_1.jsx)("span", { className: "screen__background__shape screen__background__shape4" }), (0, jsx_runtime_1.jsx)("span", { className: "screen__background__shape screen__background__shape3" }), (0, jsx_runtime_1.jsx)("span", { className: "screen__background__shape screen__background__shape2" }), (0, jsx_runtime_1.jsx)("span", { className: "screen__background__shape screen__background__shape1" })] }))] })) })));
}
exports.default = MfaSignin;
