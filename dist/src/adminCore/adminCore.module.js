"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AdminCoreModuleFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCoreModuleFactory = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const admin_controller_1 = require("./admin.controller");
const adminSite_1 = require("./adminSite");
const admin_environment_1 = require("./admin.environment");
const tokens_1 = require("../tokens");
const admin_configuration_1 = require("./admin.configuration");
let AdminCoreModuleFactory = AdminCoreModuleFactory_1 = class AdminCoreModuleFactory {
    constructor(adapterHost, appConfig) {
        this.adapterHost = adapterHost;
        this.appConfig = appConfig;
    }
    static createAdminCoreModule({ adminSite = adminSite_1.default, adminController = admin_controller_1.DefaultAdminController, adminEnvironment = admin_environment_1.default, appConfig = {}, }) {
        const adminSiteProvider = {
            provide: tokens_1.injectionTokens.ADMIN_SITE,
            useExisting: adminSite,
        };
        const adminEnvironmentProvider = {
            provide: tokens_1.injectionTokens.ADMIN_ENVIRONMENT,
            useExisting: adminEnvironment,
        };
        const appConfigProvider = {
            provide: tokens_1.injectionTokens.APP_CONFIG,
            useValue: admin_configuration_1.createAppConfiguration(appConfig),
        };
        const exportedProviders = [
            adminEnvironment,
            adminEnvironmentProvider,
            adminSite,
            adminSiteProvider,
            appConfigProvider,
        ];
        return {
            module: AdminCoreModuleFactory_1,
            controllers: [adminController],
            providers: exportedProviders,
            exports: exportedProviders,
        };
    }
    configure(consumer) {
        passport.serializeUser(this.appConfig.serializeUser);
        passport.deserializeUser(this.appConfig.deserializeUser);
        this.adapterHost.httpAdapter.useStaticAssets(admin_configuration_1.publicFolder, {
            prefix: this.appConfig.assetPrefix,
        });
        consumer
            .apply(session(this.appConfig.session), passport.initialize(), passport.session(), flash())
            .forRoutes('/admin/?');
    }
};
AdminCoreModuleFactory = AdminCoreModuleFactory_1 = __decorate([
    common_1.Module({}),
    __param(1, common_1.Inject(tokens_1.injectionTokens.APP_CONFIG)),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost, Object])
], AdminCoreModuleFactory);
exports.AdminCoreModuleFactory = AdminCoreModuleFactory;
//# sourceMappingURL=adminCore.module.js.map