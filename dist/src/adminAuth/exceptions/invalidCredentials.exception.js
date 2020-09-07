"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
class InvalidCredentials extends common_1.HttpException {
    constructor(username) {
        super('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        this.username = username;
    }
}
exports.default = InvalidCredentials;
//# sourceMappingURL=invalidCredentials.exception.js.map