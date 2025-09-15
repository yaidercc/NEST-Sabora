"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMother = void 0;
const seed_data_1 = require("../../seed/data/seed-data");
const chance_1 = require("chance");
class UserMother {
    static dto() {
        return {
            full_name: "yaider cordoba cordoba",
            username: "yaidercc",
            email: "yaider@gmail.com",
            password: "cordobac123",
            phone: "573165482746"
        };
    }
    static randomDTO() {
        return {
            full_name: (0, chance_1.Chance)().name(),
            username: (0, chance_1.Chance)().name().split(" ")[0],
            email: (0, chance_1.Chance)().email(),
            password: "cordobac123",
            phone: `573${(0, chance_1.Chance)().integer({ min: 0, max: 9 })}${(0, chance_1.Chance)().string({ length: 7, pool: '0123456789' })}`
        };
    }
    static async createManyUsers(userService, quantity) {
        const users = [];
        for (let i = 0; i < quantity; i++) {
            const user = await userService.create(UserMother.randomDTO());
            if (user) {
                users.push(user);
            }
        }
        return users;
    }
    static async seedRoles(generalRoleRepository) {
        const generalRoles = seed_data_1.initialData.generalRoles.map((item) => generalRoleRepository.create(item));
        await generalRoleRepository.save(generalRoles);
        return generalRoles[0];
    }
}
exports.UserMother = UserMother;
//# sourceMappingURL=userMother.js.map