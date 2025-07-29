import { UserMother } from "./__test__/userMother";
import { UserController } from "./user.controller"

describe("Unit tests UserControllers", () => {
    let controller: UserController;
    const mockUserController = {
        create: jest.fn()
    }
    beforeEach(() => {
        controller = new UserController(mockUserController as any)
    })

    it("create user", async() => {
        const userDTO = UserMother.dto()
        await controller.create(userDTO)
        expect(mockUserController.create).toHaveBeenCalledWith(userDTO)
    })
})