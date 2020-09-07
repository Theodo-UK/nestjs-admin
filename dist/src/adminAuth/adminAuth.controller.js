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
exports.AdminAuthController = void 0;
const common_1 = require("@nestjs/common");
const admin_environment_1 = require("../adminCore/admin.environment");
const login_guard_1 = require("./login.guard");
const tokens_1 = require("../tokens");
const admin_filters_1 = require("../adminCore/admin.filters");
const admin_filter_1 = require("./admin.filter");
let AdminAuthController = class AdminAuthController {
    constructor(env) {
        this.env = env;
    }
    login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.env.render('login.njk', { request });
        });
    }
    adminLogin(res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.redirect('/admin');
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.logout();
            res.redirect(admin_filters_1.adminUrl('login'));
        });
    }
};
__decorate([
    common_1.Get('/login'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "login", null);
__decorate([
    common_1.HttpCode(200),
    common_1.UseGuards(login_guard_1.LoginGuard),
    common_1.Post('/login'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "adminLogin", null);
__decorate([
    common_1.Post('/logout'),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "logout", null);
AdminAuthController = __decorate([
    common_1.Controller('admin'),
    common_1.UseFilters(admin_filter_1.AdminFilter),
    __param(0, common_1.Inject(tokens_1.injectionTokens.ADMIN_ENVIRONMENT)),
    __metadata("design:paramtypes", [admin_environment_1.default])
], AdminAuthController);
exports.AdminAuthController = AdminAuthController;
//# sourceMappingURL=adminAuth.controller.js.map