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
exports.CliAdminModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const typeormProxy_1 = require("../src/utils/typeormProxy");
const adminUser_entity_1 = require("../src/adminUser/adminUser.entity");
const adminUser_module_1 = require("../src/adminUser/adminUser.module");
class AdminConnectionException extends Error {
    constructor(msg) {
        super(msg);
    }
}
class CliAdminModule {
    static getConnectionOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield typeormProxy_1.getConnectionOptions();
            }
            catch (e) {
                throw new AdminConnectionException(`Could not connect to your database to create an admin user. Make sure you have an ormconfig file with a default connection or that your environment variables are set (see https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md).`);
            }
        });
    }
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionOptions = yield this.getConnectionOptions();
            const entities = connectionOptions.entities || [];
            return {
                module: CliAdminModule,
                imports: [
                    typeorm_1.TypeOrmModule.forRoot(Object.assign(Object.assign({}, connectionOptions), { entities: [...entities, adminUser_entity_1.default] })),
                    typeorm_1.TypeOrmModule.forFeature([adminUser_entity_1.default]),
                    adminUser_module_1.AdminUserModule,
                ],
            };
        });
    }
}
exports.CliAdminModule = CliAdminModule;
//# sourceMappingURL=cliAdmin.module.js.map