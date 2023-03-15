"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarModule = void 0;
const common_1 = require("@nestjs/common");
const avatar_controller_1 = require("./avatar.controller");
const avatar_service_1 = require("./avatar.service");
let AvatarModule = class AvatarModule {
};
AvatarModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [avatar_controller_1.AvatarController],
        providers: [avatar_service_1.AvatarService],
    })
], AvatarModule);
exports.AvatarModule = AvatarModule;
//# sourceMappingURL=avatar.module.js.map