"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockScheduleRepo = exports.mockReservationRepo = exports.reservationId = void 0;
exports.reservationId = "8f9c9754-30e8-40df-9022-ea959c04e035";
exports.mockReservationRepo = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn()
};
exports.mockScheduleRepo = {
    findOneBy: jest.fn(),
};
//# sourceMappingURL=reservation.mock.js.map