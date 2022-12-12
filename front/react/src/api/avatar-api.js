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
exports.deleteAvatar = exports.postAvatar = void 0;
const customAxios_1 = __importDefault(require("./customAxios"));
const postAvatar = (newAvatar) => __awaiter(void 0, void 0, void 0, function* () {
    let formdata = new FormData();
    formdata.append("avatar", newAvatar);
    return new Promise((resolve, reject) => {
        customAxios_1.default.post(`http://localhost:3333/avatar/`, formdata, {
            headers: {
                Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`),
                'Content-Type': 'multipart/form-data',
            }
        })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in postAvatar", e);
            return reject(e);
        });
    });
});
exports.postAvatar = postAvatar;
const deleteAvatar = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.delete(`http://localhost:3333/avatar/`, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in deleteAvatar", e);
            return reject(e);
        });
    });
});
exports.deleteAvatar = deleteAvatar;
