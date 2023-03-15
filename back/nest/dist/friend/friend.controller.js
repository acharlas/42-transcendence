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
exports.FriendController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorator_1 = require("../auth/decorator");
const guard_1 = require("../auth/guard");
const dto_1 = require("./dto");
const friend_service_1 = require("./friend.service");
let FriendController = class FriendController {
    constructor(friendService) {
        this.friendService = friendService;
    }
    addFriend(userId, dto) {
        return new Promise((resolve, reject) => {
            this.friendService
                .addFriend(userId, dto)
                .then((ret) => {
                ret.myfriend.forEach(x => {
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
    removeFriend(userId, dto) {
        return new Promise((resolve, reject) => {
            this.friendService
                .removeFriend(userId, dto)
                .then((ret) => {
                ret.myfriend.forEach(x => {
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
    getFriend(userId, id) {
        return new Promise((resolve, reject) => {
            this.friendService
                .getFriend(userId, id)
                .then((ret) => {
                ret.myfriend.forEach(x => {
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
};
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('add'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.FriendDto]),
    __metadata("design:returntype", Promise)
], FriendController.prototype, "addFriend", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('remove'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.FriendDto]),
    __metadata("design:returntype", Promise)
], FriendController.prototype, "removeFriend", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FriendController.prototype, "getFriend", null);
FriendController = __decorate([
    (0, swagger_1.ApiTags)('Friend'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)('friend'),
    __metadata("design:paramtypes", [friend_service_1.FriendService])
], FriendController);
exports.FriendController = FriendController;
//# sourceMappingURL=friend.controller.js.map