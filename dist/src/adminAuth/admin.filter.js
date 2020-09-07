"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminFilter = void 0;
const common_1 = require("@nestjs/common");
const admin_filters_1 = require("../adminCore/admin.filters");
const invalidCredentials_exception_1 = require("./exceptions/invalidCredentials.exception");
let AdminFilter = class AdminFilter {
    catch(exception, host) {
        const res = host.switchToHttp().getResponse();
        const req = host.switchToHttp().getRequest();
        if (exception instanceof invalidCredentials_exception_1.default) {
            req.flash('loginError', 'Invalid credentials');
            req.flash('username', exception.username);
        }
        res.redirect(admin_filters_1.adminUrl('login'));
    }
};
AdminFilter = __decorate([
    common_1.Catch(common_1.UnauthorizedException, common_1.ForbiddenException, invalidCredentials_exception_1.default)
], AdminFilter);
exports.AdminFilter = AdminFilter;
//# sourceMappingURL=admin.filter.js.map