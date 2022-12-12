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
exports.checkIfFriend = exports.getFriend = exports.removeFriend = exports.addFriend = void 0;
const customAxios_1 = __importDefault(require("./customAxios"));
const addFriend = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.post(`http://localhost:3333/friend/add/`, { userId: params.id }, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in addFriend", e);
            return reject(e);
        });
    });
});
exports.addFriend = addFriend;
const removeFriend = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.post(`http://localhost:3333/friend/remove/`, { userId: params.id }, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in removeFriend", e);
            return reject(e);
        });
    });
});
exports.removeFriend = removeFriend;
const getFriend = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.get(`http://localhost:3333/friend/` + params.id, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in getFriend", e);
            return reject(e);
        });
    });
});
exports.getFriend = getFriend;
//utils
const checkIfFriend = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const friendList = (yield (0, exports.getFriend)({ id: sessionStorage.getItem(`userid`) })).data.myfriend;
    for (let i = 0; i < friendList.length; i++) {
        if (friendList[i].id === params.id) {
            return (true);
        }
    }
    return (false);
});
exports.checkIfFriend = checkIfFriend;
