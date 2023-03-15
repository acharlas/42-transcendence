"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModule = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const message_controller_1 = require("./message.controller");
const message_gateway_1 = require("./message.gateway");
const channel_service_1 = require("../channel/channel.service");
const jwt_1 = require("@nestjs/jwt");
const friend_service_1 = require("../friend/friend.service");
const block_service_1 = require("../block/block.service");
const user_service_1 = require("../user/user.service");
const game_gateway_1 = require("../game/game.gateway");
const history_service_1 = require("../history/history.service");
const game_module_1 = require("../game/game.module");
const socket_module_1 = require("../socket/socket.module");
let MessageModule = class MessageModule {
};
MessageModule = __decorate([
    (0, common_1.Module)({
        controllers: [message_controller_1.MessageController],
        imports: [jwt_1.JwtModule, game_module_1.GameModule, socket_module_1.SocketModule],
        providers: [
            message_service_1.MessageService,
            message_gateway_1.MessageGateway,
            channel_service_1.ChannelService,
            friend_service_1.FriendService,
            block_service_1.BlockService,
            user_service_1.UserService,
            game_gateway_1.GameGateway,
            history_service_1.HistoryService,
        ],
        exports: [message_gateway_1.MessageGateway]
    })
], MessageModule);
exports.MessageModule = MessageModule;
//# sourceMappingURL=message.module.js.map