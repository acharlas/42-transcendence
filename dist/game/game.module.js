"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const schedule_1 = require("@nestjs/schedule");
const history_service_1 = require("../history/history.service");
const socket_module_1 = require("../socket/socket.module");
const user_service_1 = require("../user/user.service");
const game_service_1 = require("./game.service");
let GameModule = class GameModule {
};
GameModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule, schedule_1.ScheduleModule.forRoot(), socket_module_1.SocketModule],
        providers: [game_service_1.GameService, history_service_1.HistoryService, schedule_1.SchedulerRegistry, user_service_1.UserService, game_service_1.GameService],
        exports: [game_service_1.GameService]
    })
], GameModule);
exports.GameModule = GameModule;
//# sourceMappingURL=game.module.js.map