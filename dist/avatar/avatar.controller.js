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
exports.AvatarController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorator_1 = require("../auth/decorator");
const guard_1 = require("../auth/guard");
const api_avatar_decorator_1 = require("./api-avatar.decorator");
const avatar_service_1 = require("./avatar.service");
let AvatarController = class AvatarController {
    constructor(avatarService) {
        this.avatarService = avatarService;
    }
    postAvatar(userId, avatar) {
        console.log('postAvatar');
        if (!avatar) {
            throw new common_1.BadRequestException('no avatar');
        }
        console.log(avatar);
        this.avatarService.saveAvatar(userId, { path: avatar.path });
    }
    deleteAvatar(userId) {
        console.log('deleteAvatar');
        this.avatarService.deleteAvatar(userId);
    }
    getAvatar(targetId, res) {
        console.log('getAvatar');
        return new Promise((resolve, reject) => {
            return this.avatarService
                .getAvatar(targetId)
                .then((ret) => {
                res.set('Content-Type', 'image');
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Post)(''),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, api_avatar_decorator_1.ApiFileAvatar)(),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AvatarController.prototype, "postAvatar", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Delete)(''),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AvatarController.prototype, "deleteAvatar", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AvatarController.prototype, "getAvatar", null);
AvatarController = __decorate([
    (0, swagger_1.ApiTags)('Avatar'),
    (0, common_1.Controller)('avatar'),
    __metadata("design:paramtypes", [avatar_service_1.AvatarService])
], AvatarController);
exports.AvatarController = AvatarController;
//# sourceMappingURL=avatar.controller.js.map