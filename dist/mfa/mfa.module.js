"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfaModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mfa_controller_1 = require("./mfa.controller");
const mfa_service_1 = require("./mfa.service");
const auth_module_1 = require("../auth/auth.module");
let MfaModule = class MfaModule {
};
MfaModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.register({}), auth_module_1.AuthModule],
        controllers: [mfa_controller_1.MfaController],
        providers: [mfa_service_1.MfaService],
    })
], MfaModule);
exports.MfaModule = MfaModule;
//# sourceMappingURL=mfa.module.js.map