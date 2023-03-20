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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorator_1 = require("../auth/decorator");
const guard_1 = require("../auth/guard");
const dto_1 = require("./dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getMe(user) {
        delete user.hash;
        delete user.refreshToken;
        return user;
    }
    getUserId(userId, id) {
        return new Promise((resolve, reject) => {
            this.userService
                .getUserId(userId, id)
                .then((ret) => {
                delete ret.mfaEnabled;
                delete ret.mfaPhoneNumber;
                delete ret.hash;
                delete ret.refreshToken;
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    getUsers() {
        return new Promise((resolve, reject) => {
            this.userService
                .getUsers()
                .then((ret) => {
                ret.forEach((x) => {
                    delete x.mfaEnabled;
                    delete x.mfaPhoneNumber;
                    delete x.hash;
                    delete x.refreshToken;
                });
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    getUserHistory(userId) {
        return new Promise((resolve, reject) => {
            this.userService
                .getHistory(userId)
                .then((ret) => {
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    getAchievement(userId) {
        return new Promise((resolve, reject) => {
            this.userService
                .GetAchievement(userId)
                .then((ret) => {
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    editUser(userId, dto) {
        return new Promise((resolve, reject) => {
            this.userService
                .editUser(userId, dto)
                .then((user) => {
                return resolve(user);
            })
                .catch((err) => {
                return reject(new common_1.ForbiddenException('nickname already taken'));
            });
        });
    }
};
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserId", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('history/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserHistory", null);
__decorate([
    (0, common_1.Get)('achievement/me'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAchievement", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.EditUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editUser", null);
UserController = __decorate([
    (0, common_1.Controller)('users'),
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map