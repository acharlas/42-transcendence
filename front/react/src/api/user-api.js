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
exports.patchNickname = exports.getUsersMe = exports.getUsers = exports.getUser = void 0;
const customAxios_1 = __importDefault(require("./customAxios"));
//Get data for a specific user.
const getUser = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.get(`http://localhost:3333/users/` + params.id, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in getUser", e);
            return reject(e);
        });
    });
});
exports.getUser = getUser;
//Get data of all users.
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.get(`http://localhost:3333/users/`, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in getUsers", e);
            return reject(e);
        });
    });
});
exports.getUsers = getUsers;
//Get data of logged-in user.
const getUsersMe = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.get(`http://localhost:3333/users/me`, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem("Token") } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in getUsersMe", e);
            return reject(e);
        });
    });
});
exports.getUsersMe = getUsersMe;
const patchNickname = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.patch(`http://localhost:3333/users`, { nickname: params.nickname }, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem("Token") } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in patchNickname", e);
            return reject(e);
        });
    });
});
exports.patchNickname = patchNickname;
