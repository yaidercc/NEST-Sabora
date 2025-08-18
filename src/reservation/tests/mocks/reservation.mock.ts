export const reservationId = "8f9c9754-30e8-40df-9022-ea959c04e035"

export const mockReservationRepo = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn()

}
export const mockScheduleRepo = {
    findOneBy: jest.fn(),

}