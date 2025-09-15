"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanEmptyFieldsInterceptor = void 0;
const common_1 = require("@nestjs/common");
let CleanEmptyFieldsInterceptor = class CleanEmptyFieldsInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        if (request.body) {
            Object.keys(request.body).forEach(key => {
                if (request.body[key] === '' || request.body[key] === null) {
                    delete request.body[key];
                }
            });
        }
        return next.handle();
    }
};
exports.CleanEmptyFieldsInterceptor = CleanEmptyFieldsInterceptor;
exports.CleanEmptyFieldsInterceptor = CleanEmptyFieldsInterceptor = __decorate([
    (0, common_1.Injectable)()
], CleanEmptyFieldsInterceptor);
//# sourceMappingURL=clean-empty-fields.interceptor.js.map