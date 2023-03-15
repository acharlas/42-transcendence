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
exports.ChannelController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const channel_service_1 = require("./channel.service");
const dto_1 = require("./dto");
const client_1 = require("@prisma/client");
let ChannelController = class ChannelController {
    constructor(channelService) {
        this.channelService = channelService;
    }
    createChannel(userId, dto) {
        return new Promise((resolve, reject) => {
            this.channelService
                .createChannel(userId, dto)
                .then((ret) => {
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    getChannels(userId) {
        return new Promise((resolve, reject) => {
            this.channelService
                .getChannels(userId)
                .then((ret) => {
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    getChannelById(channelId) {
        return new Promise((resolve, reject) => {
            this.channelService
                .getChannelById(channelId)
                .then((ret) => {
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    editChannel(userId, channelId, dto) {
        return new Promise((resolve, reject) => {
            this.channelService
                .editChannel(userId, channelId, dto)
                .then((ret) => {
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    deleteChannelById(userId, channelId) {
        return new Promise((resolve, reject) => {
            this.channelService
                .deleteChannelById(userId, channelId)
                .then((ret) => {
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    joinChannel(userId, channelId, dto) {
        return new Promise((resolve, reject) => {
            this.channelService
                .joinChannelById(userId, channelId, dto)
                .then((ret) => {
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    leaveChannel(userId, channelId) {
        return new Promise((resolve, reject) => {
            this.channelService
                .leaveChannel(userId, channelId)
                .then((ret) => {
                return resolve(ret);
            })
                .catch((err) => {
                return reject(err);
            });
        });
    }
    getChannelMessage(userId, channelId) {
        return new Promise((resolve, reject) => {
            this.channelService
                .getChannelMessage(channelId, userId)
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
    (0, common_1.Post)(),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "createChannel", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        name: 'type',
        enum: client_1.ChannelType,
        required: false,
    }),
    (0, common_1.Get)(),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getChannels", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getChannelById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.EditChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "editChannel", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Delete)(':id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "deleteChannelById", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)(':id/join'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.JoinChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "joinChannel", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)(':id/leave'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "leaveChannel", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)(':id/message'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getChannelMessage", null);
ChannelController = __decorate([
    (0, common_1.Controller)('channels'),
    (0, swagger_1.ApiTags)('Channels'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __metadata("design:paramtypes", [channel_service_1.ChannelService])
], ChannelController);
exports.ChannelController = ChannelController;
//# sourceMappingURL=channel.controller.js.map