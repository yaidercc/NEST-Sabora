"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockStripe = exports.mockInvoice = exports.invoiceId = void 0;
exports.invoiceId = "504fbcc7-c8d9-4fff-a301-366e6eb5cfd6";
exports.mockInvoice = {
    create: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn()
};
exports.mockStripe = {
    createPaymentIntent: jest.fn().mockResolvedValue({ id: 'pi_123', status: 'succeeded' }),
    retrievePaymentIntent: jest.fn().mockResolvedValue({ id: 'pi_123', status: 'succeeded' }),
    createCheckoutSession: jest.fn().mockResolvedValue({ id: 'cs_test_123', url: 'https://checkout.stripe.com/test-session' }),
};
//# sourceMappingURL=invoiceMocks.js.map