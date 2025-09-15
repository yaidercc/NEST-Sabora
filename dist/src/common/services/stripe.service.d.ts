import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
export declare class StripeService {
    private readonly configService;
    private stripe;
    constructor(configService: ConfigService);
    createCheckoutSession(items: {
        name: string;
        price: number;
        quantity: number;
    }[], invoiceId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    getSession(sessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
}
