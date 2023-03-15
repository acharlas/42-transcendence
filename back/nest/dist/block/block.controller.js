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
exports.BlockController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorator_1 = require("../auth/decorator");
const guard_1 = require("../auth/guard");
const dto_1 = require("./dto");
const block_service_1 = require("./block.service");
let BlockController = class BlockController {
    constructor(blockService) {
        this.blockService = blockService;
    }
    addBlock(userId, dto) {
        return new Promise((resolve, reject) => {
            this.blockService
                .addBlock(userId, dto)
                .then((ret) => {
                ret.myblock.forEach(x => {
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
    removeBlock(userId, dto) {
        return new Promise((resolve, reject) => {
            this.blockService
                .removeBlock(userId, dto)
                .then((ret) => {
                ret.myblock.forEach(x => {
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
    getblock(userId, id) {
        return new Promise((resolve, reject) => {
            this.blockService
                .getBlock(userId, id)
                .then((ret) => {
                ret.myblock.forEach(x => {
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
    __metadata("design:paramtypes", [String, dto_1.BlockDto]),
    __metadata("design:returntype", Promise)
], BlockController.prototype, "addBlock", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('remove'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.BlockDto]),
    __metadata("design:returntype", Promise)
], BlockController.prototype, "removeBlock", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BlockController.prototype, "getblock", null);
BlockController = __decorate([
    (0, common_1.Controller)('Block'),
    (0, swagger_1.ApiTags)('Block'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)('block'),
    __metadata("design:paramtypes", [block_service_1.BlockService])
], BlockController);
exports.BlockController = BlockController;
//# sourceMappingURL=block.controller.js.map