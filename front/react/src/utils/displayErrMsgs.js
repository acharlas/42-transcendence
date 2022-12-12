"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
function displayErrorMsgs(msg, errorClass = "error-msg") {
    return (Array.isArray(msg)
        ? (0, jsx_runtime_1.jsx)("p", Object.assign({ className: errorClass }, { children: msg.join(' ') }))
        : (0, jsx_runtime_1.jsx)("p", Object.assign({ className: errorClass }, { children: msg })));
}
exports.default = displayErrorMsgs;
;
