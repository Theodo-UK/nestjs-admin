"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.LoginGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let LoginGuard = class LoginGuard extends passport_1.AuthGuard('local') {
    canActivate(context) {
        const _super = Object.create(null, {
            canActivate: { get: () => super.canActivate },
            logIn: { get: () => super.logIn }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield _super.canActivate.call(this, context));
            const request = context.switchToHttp().getRequest();
            yield _super.logIn.call(this, request);
            return result;
        });
    }
};
LoginGuard = __decorate([
    common_1.Injectable()
], LoginGuard);
exports.LoginGuard = LoginGuard;
//# sourceMappingURL=login.guard.js.map