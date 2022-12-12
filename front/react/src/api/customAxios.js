"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// const responseHandler = response => {
//   console.log(response);
//   return response;
// };
const errorHandler = error => {
    var _a, _b, _c;
    // console.log(error);
    if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
        if (((_c = (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) === "2FA required") {
            console.log("Missing 2fa: redirecting to 2fa page.");
            window.location.href = "/mfa-signin";
        }
        else {
            console.log("No auth: redirecting to login page.");
            window.location.href = "/";
        }
    }
    return Promise.reject(error);
};
axios_1.default.interceptors.response.use(
// (response) => responseHandler(response),
(error) => errorHandler(error));
exports.default = axios_1.default.create({});
