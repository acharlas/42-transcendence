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
exports.requestMfaSigninFinish = exports.requestMfaSigninInit = exports.requestMfaSetupFinish = exports.requestMfaSetupInit = exports.requestMfaDisable = void 0;
const customAxios_1 = __importDefault(require("./customAxios"));
const requestMfaDisable = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.delete(`http://localhost:3333/mfa/disable`, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in requestMfaDisable", e);
            return reject(e);
        });
    });
});
exports.requestMfaDisable = requestMfaDisable;
const requestMfaSetupInit = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.post(`http://localhost:3333/mfa/setup/init`, { phoneNumber: params.phoneNumber }, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in requestMfaSetupInit", e);
            return reject(e);
        });
    });
});
exports.requestMfaSetupInit = requestMfaSetupInit;
const requestMfaSetupFinish = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.post(`http://localhost:3333/mfa/setup/validate`, { codeToCheck: params.codeToCheck }, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in requestMfaSetupFinish", e);
            return reject(e);
        });
    });
});
exports.requestMfaSetupFinish = requestMfaSetupFinish;
const requestMfaSigninInit = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.post(`http://localhost:3333/mfa/signin/init`, {}, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in requestMfaSigninInit", e);
            return reject(e);
        });
    });
});
exports.requestMfaSigninInit = requestMfaSigninInit;
const requestMfaSigninFinish = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default.post(`http://localhost:3333/mfa/signin/validate`, { codeToCheck: params.codeToCheck }, { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
            .then((ret) => {
            return resolve(ret);
        })
            .catch((e) => {
            console.log("Error in requestMfaSigninFinish", e);
            return reject(e);
        });
    });
});
exports.requestMfaSigninFinish = requestMfaSigninFinish;
