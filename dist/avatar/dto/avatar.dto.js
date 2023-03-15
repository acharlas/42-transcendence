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
exports.AvatarPathDto = exports.AvatarUploadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const nestjs_form_data_1 = require("nestjs-form-data");
class AvatarUploadDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, nestjs_form_data_1.IsFile)(),
    (0, nestjs_form_data_1.MaxFileSize)(1e6),
    (0, nestjs_form_data_1.MinFileSize)(1),
    (0, nestjs_form_data_1.HasMimeType)(['image/jpeg', 'image/png']),
    __metadata("design:type", nestjs_form_data_1.MemoryStoredFile)
], AvatarUploadDto.prototype, "avatar", void 0);
exports.AvatarUploadDto = AvatarUploadDto;
class AvatarPathDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AvatarPathDto.prototype, "path", void 0);
exports.AvatarPathDto = AvatarPathDto;
//# sourceMappingURL=avatar.dto.js.map