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
exports.checkIfBlocked = exports.getBlock = exports.removeBlock = exports.addBlock = void 0;
const customAxios_1 = __importDefault(require("./customAxios"));
const addBlock = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.post(`http://localhost:3333/block/add/`, { userId: params.id }, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in addBlock", e);
            return reject(e);
        });
    });
});
exports.addBlock = addBlock;
const removeBlock = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.post(`http://localhost:3333/block/remove/`, { userId: params.id }, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in removeBlock", e);
            return reject(e);
        });
    });
});
exports.removeBlock = removeBlock;
const getBlock = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.get(`http://localhost:3333/block/` + params.id, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in getBlock", e);
            return reject(e);
        });
    });
});
exports.getBlock = getBlock;
//utils
const checkIfBlocked = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const blockList = (yield (0, exports.getBlock)({ id: sessionStorage.getItem(`userid`) })).data.myblock;
    for (let i = 0; i < blockList.length; i++) {
        if (blockList[i].id === params.id) {
            return (true);
        }
    }
    return (false);
});
exports.checkIfBlocked = checkIfBlocked;
