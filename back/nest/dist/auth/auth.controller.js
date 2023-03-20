"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const decorator_1 = require("./decorator");
const dto_1 = require("./dto");
const guard_1 = require("./guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signup(dto) {
        return new Promise((resolve, reject) => {
            this.authService
                .signup(dto)
                .then((ret) => {
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async signin(dto) {
        return new Promise((resolve, reject) => {
            this.authService
                .signin(dto)
                .then((ret) => {
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    async signinApi(dto) {
        return new Promise((resolve, reject) => {
            this.authService
                .getApiToken(dto)
                .then((ret) => {
                this.authService
                    .getFortyTwoMe(ret)
                    .then((ret) => {
                    this.authService
                        .signWithApi(ret)
                        .then((ret) => {
                        return resolve(ret);
                    })
                        .catch((err) => {
                        return reject(err);
                    });
                })
                    .catch((err) => {
                    return reject(err);
                });
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    refreshTokens(req) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }
    logout(userId) {
        return new Promise((resolve, reject) => {
            this.authService
                .logout(userId)
                .then((ret) => {
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
};
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AuthSignupDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AuthSigninDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('signinApi'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.getApiToken]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signinApi", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guard_1.JwtRefreshGuard),
    (0, common_1.Get)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Delete)('logout'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('Auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map