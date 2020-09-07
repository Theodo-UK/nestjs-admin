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
const typeormProxy_1 = require("../utils/typeormProxy");
let AdminUser = class AdminUser {
    toString() {
        if (this.username) {
            return `${this.id} - ${this.username}`;
        }
        return this.id;
    }
};
__decorate([
    typeormProxy_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], AdminUser.prototype, "id", void 0);
__decorate([
    typeormProxy_1.Column({ length: 50, unique: true, nullable: false }),
    __metadata("design:type", String)
], AdminUser.prototype, "username", void 0);
__decorate([
    typeormProxy_1.Column({ length: 128, nullable: false }),
    __metadata("design:type", String)
], AdminUser.prototype, "password", void 0);
AdminUser = __decorate([
    typeormProxy_1.Entity('adminUser')
], AdminUser);
exports.default = AdminUser;
//# sourceMappingURL=adminUser.entity.js.map