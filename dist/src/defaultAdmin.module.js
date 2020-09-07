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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const adminCore_module_1 = require("./adminCore/adminCore.module");
const adminSite_1 = require("./adminCore/adminSite");
const adminUser_entity_1 = require("./adminUser/adminUser.entity");
const adminUser_module_1 = require("./adminUser/adminUser.module");
const DefaultCoreModule = adminCore_module_1.AdminCoreModuleFactory.createAdminCoreModule({});
let DefaultAdminModule = class DefaultAdminModule {
    constructor(adminSite) {
        this.adminSite = adminSite;
        adminSite.register('Administration', adminUser_entity_1.default);
    }
};
DefaultAdminModule = __decorate([
    common_1.Module({
        imports: [DefaultCoreModule, adminUser_module_1.AdminUserModule],
        exports: [DefaultCoreModule, adminUser_module_1.AdminUserModule],
    }),
    __metadata("design:paramtypes", [adminSite_1.default])
], DefaultAdminModule);
exports.default = DefaultAdminModule;
//# sourceMappingURL=defaultAdmin.module.js.map