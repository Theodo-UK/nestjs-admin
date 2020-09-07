"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateUsernameException = void 0;
class DuplicateUsernameException extends Error {
    constructor(username) {
        super(`There is already an AdminUser with this username: ${username}`);
    }
}
exports.DuplicateUsernameException = DuplicateUsernameException;
//# sourceMappingURL=userAdmin.exception.js.map