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
exports.fortyTwoSign = exports.signup = exports.signin = exports.getMe = void 0;
const customAxios_1 = __importDefault(require("./customAxios"));
const getMe = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        customAxios_1.default
            .get("http://localhost:3333/users/me", {
            headers: {
                Authorization: "Bearer " + dto.token,
            },
        })
            .then((ret) => {
            sessionStorage.setItem("username", ret.data.username);
            sessionStorage.setItem("nickname", ret.data.nickname);
            sessionStorage.setItem("userid", ret.data.id);
            return resolve();
        })
            .catch((err) => {
            console.log({ err });
            return reject(err);
        });
    });
});
exports.getMe = getMe;
const signin = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield customAxios_1.default.post("http://localhost:3333/auth/signin", {
        username: credentials.username,
        password: credentials.password,
    });
    return response.data.access_token;
});
exports.signin = signin;
const signup = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield customAxios_1.default.post("http://localhost:3333/auth/signup", {
        password: credentials.password,
        username: credentials.username,
    });
    return response.data.access_token;
});
exports.signup = signup;
const fortyTwoSign = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield customAxios_1.default.post("http://localhost:3333/auth/signinApi", {
            code: dto.code,
            state: dto.state,
        });
        window.sessionStorage.setItem("Token", response.data.access_token);
        return response;
    }
    catch (e) {
        console.log("Oauth error", { e });
        return e;
    }
});
exports.fortyTwoSign = fortyTwoSign;
