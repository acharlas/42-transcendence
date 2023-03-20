"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBearer = void 0;
const common_1 = require("@nestjs/common");
exports.GetBearer = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user == undefined) {
        throw new common_1.BadRequestException('Could not get user');
    }
    if (data) {
        return request.user[data];
    }
    return request.user;
});
//# sourceMappingURL=get-bearer.decorator.js.map