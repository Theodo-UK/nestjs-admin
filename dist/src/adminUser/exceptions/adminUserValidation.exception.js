"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserValidationException = void 0;
class AdminUserValidationException extends Error {
    constructor() {
        super(`Username and password are required.`);
    }
}
exports.AdminUserValidationException = AdminUserValidationException;
//# sourceMappingURL=adminUserValidation.exception.js.map