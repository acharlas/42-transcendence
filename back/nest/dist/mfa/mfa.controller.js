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
exports.MfaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const mfa_service_1 = require("./mfa.service");
const mfa_setup_dto_1 = require("./dto/mfa-setup.dto");
const mfa_validate_dto_1 = require("./dto/mfa-validate.dto");
let MfaController = class MfaController {
    constructor(mfaService) {
        this.mfaService = mfaService;
    }
    async initSignIn(userId) {
        return this.mfaService.initSignIn(userId);
    }
    async validateSignIn(userId, dto) {
        return this.mfaService.validateSignIn(userId, dto);
    }
    async initSetup(userId, dto) {
        return this.mfaService.initSetup(userId, dto);
    }
    async finishSetup(userId, dto) {
        return this.mfaService.finishSetup(userId, dto);
    }
    async disable(userId) {
        return this.mfaService.disable(userId);
    }
};
__decorate([
    (0, common_1.Post)('signin/init'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MfaController.prototype, "initSignIn", null);
__decorate([
    (0, common_1.Post)('signin/validate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mfa_validate_dto_1.MfaValidateDto]),
    __metadata("design:returntype", Promise)
], MfaController.prototype, "validateSignIn", null);
__decorate([
    (0, common_1.Post)('setup/init'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mfa_setup_dto_1.MfaSetupDto]),
    __metadata("design:returntype", Promise)
], MfaController.prototype, "initSetup", null);
__decorate([
    (0, common_1.Post)('setup/validate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, decorator_1.GetUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mfa_validate_dto_1.MfaValidateDto]),
    __metadata("design:returntype", Promise)
], MfaController.prototype, "finishSetup", null);
__decorate([
    (0, common_1.Delete)('disable'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MfaController.prototype, "disable", null);
MfaController = __decorate([
    (0, common_1.Controller)('mfa'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Mfa'),
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    __metadata("design:paramtypes", [mfa_service_1.MfaService])
], MfaController);
exports.MfaController = MfaController;
//# sourceMappingURL=mfa.controller.js.map