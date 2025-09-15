export const invoiceId = "504fbcc7-c8d9-4fff-a301-366e6eb5cfd6"

export const mockInvoice = {
    create: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn()
}

export const mockStripe = {
    createPaymentIntent: jest.fn().mockResolvedValue({ id: 'pi_123', status: 'succeeded' }),
    retrievePaymentIntent: jest.fn().mockResolvedValue({ id: 'pi_123', status: 'succeeded' }),
      createCheckoutSession: jest.fn().mockResolvedValue({ id: 'cs_test_123', url: 'https://checkout.stripe.com/test-session' }),

}