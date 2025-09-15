"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowOwnerOrAdmin = exports.OWNER_ADMIN_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.OWNER_ADMIN_KEY = 'allow_owner_or_admin';
const AllowOwnerOrAdmin = (options) => {
    return (0, common_1.SetMetadata)(exports.OWNER_ADMIN_KEY, options);
};
exports.AllowOwnerOrAdmin = AllowOwnerOrAdmin;
//# sourceMappingURL=owner-protected.decorator.js.map