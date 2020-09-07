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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcryptjs_1 = require("bcryptjs");
const typeorm_2 = require("typeorm");
const typeormProxy_1 = require("../utils/typeormProxy");
const adminUser_entity_1 = require("./adminUser.entity");
const userAdmin_exception_1 = require("./exceptions/userAdmin.exception");
const adminUserValidation_exception_1 = require("./exceptions/adminUserValidation.exception");
let AdminUserService = class AdminUserService {
    constructor(connection, entityManager) {
        this.connection = connection;
        this.entityManager = entityManager;
        connection.subscribers.push(this);
    }
    listenTo() {
        return adminUser_entity_1.default;
    }
    hashPassword(password) {
        return bcryptjs_1.hashSync(password, 12);
    }
    comparePassword(adminUser, password) {
        return bcryptjs_1.compareSync(password, adminUser.password);
    }
    beforeInsert(event) {
        event.entity.password = this.hashPassword(event.entity.password);
    }
    beforeUpdate(event) {
        if (!event.entity || !event.databaseEntity)
            return;
        const isPasswordUpdated = !this.comparePassword(event.entity, event.databaseEntity.password);
        if (isPasswordUpdated) {
            event.entity.password = this.hashPassword(event.entity.password);
        }
        else {
            event.entity.password = event.databaseEntity.password;
        }
    }
    create(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.entityManager.findOne(adminUser_entity_1.default, { username })) {
                throw new userAdmin_exception_1.DuplicateUsernameException(username);
            }
            if (!username || !password) {
                throw new adminUserValidation_exception_1.AdminUserValidationException();
            }
            const admin = new adminUser_entity_1.default();
            admin.username = username;
            admin.password = password;
            yield this.entityManager.save(admin);
        });
    }
    findOne(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.entityManager.findOne(adminUser_entity_1.default, { where: { username } });
        });
    }
    validateAdminCredentials(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield this.findOne(username);
            if (adminUser && this.comparePassword(adminUser, password)) {
                const { password: pass } = adminUser, result = __rest(adminUser, ["password"]);
                return result;
            }
            return null;
        });
    }
};
AdminUserService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectConnection()),
    __metadata("design:paramtypes", [typeormProxy_1.Connection,
        typeorm_2.EntityManager])
], AdminUserService);
exports.AdminUserService = AdminUserService;
//# sourceMappingURL=adminUser.service.js.map