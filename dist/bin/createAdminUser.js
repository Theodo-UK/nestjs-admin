"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminUser = void 0;
const inquirer_1 = require("inquirer");
const adminUser_service_1 = require("../src/adminUser/adminUser.service");
function createAdminUser(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const adminUserService = app.get(adminUser_service_1.AdminUserService);
        const { username, password } = yield inquirer_1.prompt([
            {
                type: 'input',
                name: 'username',
                message: 'Username:',
            },
            {
                type: 'password',
                name: 'password',
                message: 'Password:',
            },
        ]);
        yield adminUserService.create(username, password);
    });
}
exports.createAdminUser = createAdminUser;
//# sourceMappingURL=createAdminUser.js.map