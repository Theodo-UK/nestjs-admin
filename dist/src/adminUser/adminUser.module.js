"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const adminAuth_module_1 = require("../adminAuth/adminAuth.module");
const adminUser_entity_1 = require("./adminUser.entity");
const adminUser_service_1 = require("./adminUser.service");
const adminUser_entity_2 = require("./adminUser.entity");
const adminUserCredentialValidator = {
    imports: [typeorm_1.TypeOrmModule.forFeature([adminUser_entity_1.default])],
    useFactory: (adminUserService) => {
        return adminUserService.validateAdminCredentials.bind(adminUserService);
    },
    inject: [adminUser_service_1.AdminUserService],
};
let AdminUserModule = class AdminUserModule {
};
AdminUserModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([adminUser_entity_2.default]),
            adminAuth_module_1.AdminAuthModuleFactory.createAdminAuthModule({
                credentialValidator: adminUserCredentialValidator,
                providers: [adminUser_service_1.AdminUserService],
            }),
        ],
        exports: [adminAuth_module_1.AdminAuthModuleFactory, adminUser_service_1.AdminUserService],
        providers: [adminAuth_module_1.AdminAuthModuleFactory, adminUser_service_1.AdminUserService]
    })
], AdminUserModule);
exports.AdminUserModule = AdminUserModule;
//# sourceMappingURL=adminUser.module.js.map