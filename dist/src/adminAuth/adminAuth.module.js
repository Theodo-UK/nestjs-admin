"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AdminAuthModuleFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthModuleFactory = void 0;
const common_1 = require("@nestjs/common");
const local_strategy_1 = require("./local.strategy");
const adminAuth_controller_1 = require("./adminAuth.controller");
const adminCore_module_1 = require("../adminCore/adminCore.module");
const tokens_1 = require("../tokens");
const defaultCoreModule = adminCore_module_1.AdminCoreModuleFactory.createAdminCoreModule({});
let AdminAuthModuleFactory = AdminAuthModuleFactory_1 = class AdminAuthModuleFactory {
    static createAdminAuthModule({ adminCoreModule = defaultCoreModule, credentialValidator, providers = [], imports = [], }) {
        const credentialValidatorProvider = {
            provide: tokens_1.injectionTokens.ADMIN_AUTH_CREDENTIAL_VALIDATOR,
            useFactory: credentialValidator.useFactory,
            inject: credentialValidator.inject,
        };
        return {
            module: AdminAuthModuleFactory_1,
            imports: [adminCoreModule, ...imports],
            exports: [credentialValidatorProvider, ...providers],
            providers: [credentialValidatorProvider, ...providers],
        };
    }
};
AdminAuthModuleFactory = AdminAuthModuleFactory_1 = __decorate([
    common_1.Module({
        providers: [local_strategy_1.LocalStrategy],
        controllers: [adminAuth_controller_1.AdminAuthController],
    })
], AdminAuthModuleFactory);
exports.AdminAuthModuleFactory = AdminAuthModuleFactory;
//# sourceMappingURL=adminAuth.module.js.map