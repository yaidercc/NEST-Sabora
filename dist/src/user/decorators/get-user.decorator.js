"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUser = void 0;
const common_1 = require("@nestjs/common");
exports.GetUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user)
        throw new common_1.InternalServerErrorException("User not found in the request");
    return data ? user[data] : user;
});
//# sourceMappingURL=get-user.decorator.js.map