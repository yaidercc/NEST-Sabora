export declare const invoiceId = "504fbcc7-c8d9-4fff-a301-366e6eb5cfd6";
export declare const mockInvoice: {
    create: jest.Mock<any, any, any>;
    update: jest.Mock<any, any, any>;
    save: jest.Mock<any, any, any>;
    find: jest.Mock<any, any, any>;
    findOne: jest.Mock<any, any, any>;
    findOneBy: jest.Mock<any, any, any>;
};
export declare const mockStripe: {
    createPaymentIntent: jest.Mock<any, any, any>;
    retrievePaymentIntent: jest.Mock<any, any, any>;
    createCheckoutSession: jest.Mock<any, any, any>;
};
