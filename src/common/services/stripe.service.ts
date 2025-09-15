import Stripe from 'stripe';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.stripe = new Stripe(this.configService.get("STRIPE_SECRET_KEY")!, {
            apiVersion: "2025-08-27.basil"
        })
    }

    async createCheckoutSession(items: { name: string, price: number, quantity: number }[], invoiceId: string) {
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
        })
    }


    async getSession(sessionId: string) {
        return this.stripe.checkout.sessions.retrieve(sessionId);
    }
}