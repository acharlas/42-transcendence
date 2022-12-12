"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const defaultPicture_png_1 = __importDefault(require("../image/defaultPicture.png"));
function DefaultAvatar(classname = "profile__avatar") {
    return ((0, jsx_runtime_1.jsx)("img", { className: classname, src: defaultPicture_png_1.default, alt: "" }));
}
exports.default = DefaultAvatar;
