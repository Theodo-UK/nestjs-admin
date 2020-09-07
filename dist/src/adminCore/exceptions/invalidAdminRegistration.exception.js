"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidAdminRegistration = void 0;
class InvalidAdminRegistration extends Error {
    constructor(registered) {
        super(`Cannot register ${registered} in the admin site. You can only register TypeORM entities or subclasses of AdminEntity.`);
    }
}
exports.InvalidAdminRegistration = InvalidAdminRegistration;
//# sourceMappingURL=invalidAdminRegistration.exception.js.map