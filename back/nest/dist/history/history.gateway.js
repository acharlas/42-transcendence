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
exports.HistoryGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const history_service_1 = require("./history.service");
const create_history_dto_1 = require("./dto/create-history.dto");
let HistoryGateway = class HistoryGateway {
    constructor(historyService) {
        this.historyService = historyService;
    }
    create(createHistoryDto) {
        return this.historyService.createhistory(createHistoryDto);
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('createHistory'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_history_dto_1.CreateHistoryDto]),
    __metadata("design:returntype", void 0)
], HistoryGateway.prototype, "create", null);
HistoryGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [history_service_1.HistoryService])
], HistoryGateway);
exports.HistoryGateway = HistoryGateway;
//# sourceMappingURL=history.gateway.js.map