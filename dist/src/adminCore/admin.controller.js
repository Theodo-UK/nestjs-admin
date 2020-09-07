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
exports.DefaultAdminController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const express = require("express");
const adminSite_1 = require("./adminSite");
const admin_environment_1 = require("./admin.environment");
const urls = require("../utils/urls");
const typechecks_1 = require("../utils/typechecks");
const admin_guard_1 = require("./admin.guard");
const admin_filter_1 = require("../adminAuth/admin.filter");
const tokens_1 = require("../tokens");
const entity_1 = require("../utils/entity");
const admin_filters_1 = require("./admin.filters");
let DefaultAdminController = class DefaultAdminController {
    constructor(adminSite, env, entityManager) {
        this.adminSite = adminSite;
        this.env = env;
        this.entityManager = entityManager;
    }
    getEntityWithRelations(adminEntity, primaryKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = adminEntity.metadata;
            const relations = metadata.relations.map(r => r.propertyName);
            return (yield this.entityManager.findOneOrFail(adminEntity.entity, primaryKey, {
                relations,
            }));
        });
    }
    getAdminModels(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = {};
            if (query.sectionName) {
                result.section = this.adminSite.getSection(query.sectionName);
                if (query.entityName) {
                    result.adminEntity = result.section.getAdminEntity(query.entityName);
                    result.metadata = result.adminEntity.metadata;
                    if (query.primaryKey) {
                        const decodedPrimaryKey = JSON.parse(decodeURIComponent(query.primaryKey));
                        result.entity = yield this.getEntityWithRelations(result.adminEntity, decodedPrimaryKey);
                    }
                }
            }
            return result;
        });
    }
    index(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const sections = this.adminSite.getSectionList();
            return yield this.env.render('index.njk', { sections, request });
        });
    }
    changeList(request, params, pageParam = '1', searchString) {
        return __awaiter(this, void 0, void 0, function* () {
            const { section, metadata, adminEntity } = yield this.getAdminModels(params);
            const page = parseInt(pageParam, 10);
            const { entities, count } = yield this.adminSite.getEntityList(adminEntity, page, searchString);
            adminEntity.validateListConfig();
            request.flash('searchString', searchString);
            return yield this.env.render('changelist.njk', {
                request,
                section,
                entities,
                count,
                metadata,
                page,
                adminEntity,
            });
        });
    }
    add(request, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { section, metadata, adminEntity } = yield this.getAdminModels(params);
            return yield this.env.render('add.njk', { request, section, metadata, adminEntity });
        });
    }
    create(request, createEntityDto, params, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { section, metadata } = yield this.getAdminModels(params);
            let entityToBePersisted = yield this.adminSite.cleanValues(createEntityDto, metadata);
            if (typechecks_1.isClass(metadata.target)) {
                entityToBePersisted = Object.assign(new metadata.target(), entityToBePersisted);
            }
            const createdEntity = yield this.entityManager.save(entityToBePersisted);
            request.flash('messages', `Successfully created ${admin_filters_1.prettyPrint(metadata.name)}: ${admin_filters_1.displayName(createdEntity, metadata)}`);
            return response.redirect(urls.changeUrl(section, metadata, createdEntity));
        });
    }
    change(request, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { section, adminEntity, metadata, entity } = yield this.getAdminModels(params);
            return yield this.env.render('change.njk', { request, section, adminEntity, metadata, entity });
        });
    }
    update(request, updateEntityDto, params, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { section, adminEntity, metadata, entity } = yield this.getAdminModels(params);
            const updatedValues = yield this.adminSite.cleanValues(updateEntityDto, metadata);
            const entityToBePersisted = Object.assign(new metadata.target(), entity, updatedValues);
            yield this.entityManager.update(adminEntity.entity, metadata.getEntityIdMap(entity), metadata.getEntityIdMap(entityToBePersisted));
            yield this.entityManager.save(entityToBePersisted);
            const updatedEntity = yield this.getEntityWithRelations(adminEntity, entity_1.getPrimaryKeyValue(metadata, entityToBePersisted));
            request.flash('messages', `Successfully updated ${admin_filters_1.prettyPrint(metadata.name)}: ${admin_filters_1.displayName(entity, metadata)}`);
            return response.redirect(urls.changeUrl(section, metadata, updatedEntity));
        });
    }
    delete(request, params, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { section, metadata, entity } = yield this.getAdminModels(params);
            const entityDisplayName = admin_filters_1.displayName(entity, metadata);
            yield this.entityManager.remove(entity);
            request.flash('messages', `Successfully deleted ${admin_filters_1.prettyPrint(metadata.name)}: ${entityDisplayName}`);
            return response.redirect(urls.changeListUrl(section, metadata));
        });
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DefaultAdminController.prototype, "index", null);
__decorate([
    common_1.Get(':sectionName/:entityName'),
    __param(0, common_1.Req()),
    __param(1, common_1.Param()),
    __param(2, common_1.Query('page')),
    __param(3, common_1.Query('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], DefaultAdminController.prototype, "changeList", null);
__decorate([
    common_1.Get(':sectionName/:entityName/add'),
    __param(0, common_1.Req()), __param(1, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DefaultAdminController.prototype, "add", null);
__decorate([
    common_1.Post(':sectionName/:entityName/add'),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __param(2, common_1.Param()),
    __param(3, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DefaultAdminController.prototype, "create", null);
__decorate([
    common_1.Get(':sectionName/:entityName/:primaryKey/change'),
    __param(0, common_1.Req()), __param(1, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DefaultAdminController.prototype, "change", null);
__decorate([
    common_1.Post(':sectionName/:entityName/:primaryKey/change'),
    __param(0, common_1.Req()),
    __param(1, common_1.Body()),
    __param(2, common_1.Param()),
    __param(3, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DefaultAdminController.prototype, "update", null);
__decorate([
    common_1.Post(':sectionName/:entityName/:primaryKey/delete'),
    __param(0, common_1.Req()),
    __param(1, common_1.Param()),
    __param(2, common_1.Response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DefaultAdminController.prototype, "delete", null);
DefaultAdminController = __decorate([
    common_1.Controller('admin'),
    common_1.UseGuards(admin_guard_1.AdminGuard),
    common_1.UseFilters(admin_filter_1.AdminFilter),
    __param(0, common_1.Inject(tokens_1.injectionTokens.ADMIN_SITE)),
    __param(1, common_1.Inject(tokens_1.injectionTokens.ADMIN_ENVIRONMENT)),
    __metadata("design:paramtypes", [adminSite_1.default,
        admin_environment_1.default,
        typeorm_1.EntityManager])
], DefaultAdminController);
exports.DefaultAdminController = DefaultAdminController;
//# sourceMappingURL=admin.controller.js.map