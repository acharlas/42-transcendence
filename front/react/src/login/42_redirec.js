"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const auth_api_1 = require("../api/auth-api");
function Redirect() {
    let navigate = (0, react_router_dom_1.useNavigate)();
    const [searchParams] = (0, react_router_dom_1.useSearchParams)();
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    (0, auth_api_1.fortyTwoSign)({ code: code, state: state })
        .then((res) => {
        const token = res.data.access_token;
        const tokenInfo = (0, jwt_decode_1.default)(token); //can throw InvalidTokenError
        if (tokenInfo.fullyAuth) {
            navigate("/app");
        }
        else {
            navigate("/mfa-signin");
        }
    })
        .catch((e) => {
        console.log("error in Redirect():", e);
        navigate("/");
    });
    return (0, jsx_runtime_1.jsx)("div", { className: "login__container" });
}
exports.default = Redirect;
