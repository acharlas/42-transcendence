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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const prisma_service_1 = require("../prisma/prisma.service");
let AvatarService = class AvatarService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveAvatar(userId, dto) {
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                avatarPath: dto.path,
            },
        });
        return true;
    }
    async deleteAvatar(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (user.avatarPath) {
            (0, fs_1.unlinkSync)(user.avatarPath);
            await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    avatarPath: '',
                },
            });
        }
    }
    async getAvatar(targetId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: targetId,
            },
        });
        if (user === null || user === void 0 ? void 0 : user.avatarPath) {
            try {
                const file = (0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), user.avatarPath));
                return new common_1.StreamableFile(file);
            }
            catch (e) {
                throw new common_1.NotFoundException();
            }
        }
        throw new common_1.NotFoundException();
    }
};
AvatarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AvatarService);
exports.AvatarService = AvatarService;
//# sourceMappingURL=avatar.service.js.map