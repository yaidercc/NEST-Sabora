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
exports.StripeService = void 0;
const stripe_1 = require("stripe");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let StripeService = class StripeService {
    configService;
    stripe;
    constructor(configService) {
        this.configService = configService;
        this.stripe = new stripe_1.default(this.configService.get("STRIPE_SECRET_KEY"), {
            apiVersion: "2025-08-27.basil"
        });
    }
    async createCheckoutSession(items, invoiceId) {
        return this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: 'payment',
            line_items: items.map((item) => ({
                price_data: {
                    currency: "cop",
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity
            })),
            success_url: 'https://www.youtube.com/',
            cancel_url: 'https://www.google.com/',
            metadata: {
                invoice_id: invoiceId,
            },
        });
    }
    async getSession(sessionId) {
        return this.stripe.checkout.sessions.retrieve(sessionId);
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map