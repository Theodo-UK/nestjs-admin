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
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const formatting_1 = require("../utils/formatting");
const adminSection_1 = require("./adminSection");
const column_1 = require("../utils/column");
const adminEntity_1 = require("./adminEntity");
const invalidAdminRegistration_exception_1 = require("./exceptions/invalidAdminRegistration.exception");
let DefaultAdminSite = class DefaultAdminSite {
    constructor(connection, entityManager) {
        this.connection = connection;
        this.entityManager = entityManager;
        this.siteHeader = 'NestJS Administration';
        this.defaultDateFormat = 'YYYY-MM-DD hh:mm:ss';
        this.sections = {};
    }
    getOrCreateSection(sectionName) {
        if (!this.sections[sectionName]) {
            this.sections[sectionName] = new adminSection_1.default(sectionName);
        }
        return this.sections[sectionName];
    }
    register(unsafeName, adminEntityOrEntity) {
        const name = formatting_1.parseName(unsafeName);
        const section = this.getOrCreateSection(name);
        if (adminEntityOrEntity.prototype instanceof adminEntity_1.default) {
            const AdminEntityClass = adminEntityOrEntity;
            const adminEntity = new AdminEntityClass(this, this.connection);
            section.register(adminEntity);
        }
        else if (this.connection.hasMetadata(adminEntityOrEntity)) {
            const entity = adminEntityOrEntity;
            class AdminEntityClass extends adminEntity_1.default {
                constructor() {
                    super(...arguments);
                    this.entity = entity;
                }
            }
            const adminEntity = new AdminEntityClass(this, this.connection);
            section.register(adminEntity);
        }
        else {
            throw new invalidAdminRegistration_exception_1.InvalidAdminRegistration(adminEntityOrEntity);
        }
    }
    getEntityList(adminEntity, page, searchSting) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield adminEntity.getEntityList(page, searchSting);
        });
    }
    getSectionList() {
        const keys = Object.keys(this.sections);
        return keys.sort((k1, k2) => k1.localeCompare(k2)).map(key => this.sections[key]);
    }
    getSection(unsafeName) {
        const name = formatting_1.parseName(unsafeName);
        const section = this.sections[name];
        if (!section) {
            throw new Error(`Section "${unsafeName}" does not exist. Have you registered an entity under this section?`);
        }
        return section;
    }
    getRepository(entity) {
        return this.entityManager.getRepository(entity);
    }
    getEntityMetadata(entity) {
        return this.connection.getMetadata(entity);
    }
    cleanValues(values, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const propertyNames = Object.keys(values);
            const cleanedValues = {};
            for (const property of propertyNames) {
                const value = values[property];
                const column = metadata.findColumnWithPropertyName(property);
                if (!column) {
                    const relation = metadata.findRelationWithPropertyPath(property);
                    const repo = this.entityManager.getRepository(relation.type);
                    let selectedValues;
                    if (Array.isArray(value)) {
                        selectedValues = yield repo.findByIds(value.slice(1));
                    }
                    else {
                        selectedValues = [];
                    }
                    cleanedValues[property] = selectedValues;
                    continue;
                }
                if (!value) {
                    if (!!column.relationMetadata ||
                        (column_1.isNumberType(column.type) && value !== 0) ||
                        column_1.isDateType(column.type) ||
                        column_1.isEnumType(column.type) ||
                        column_1.isDateType(column.type)) {
                        cleanedValues[property] = null;
                    }
                    if (column_1.isBooleanType(column.type) && value !== false) {
                        cleanedValues[property] = column.isNullable ? null : false;
                    }
                    if (column_1.isEnumType(column.type) && value === '') {
                        cleanedValues[property] = null;
                    }
                }
                else {
                    if (column_1.isIntegerType(column.type)) {
                        cleanedValues[property] = parseInt(value, 10);
                    }
                    if (column_1.isDecimalType(column.type)) {
                        cleanedValues[property] = parseFloat(value);
                    }
                    if (column_1.isBooleanType(column.type)) {
                        if (column.isNullable) {
                            switch (value) {
                                case 'true':
                                    cleanedValues[property] = true;
                                    break;
                                case 'false':
                                    cleanedValues[property] = false;
                                    break;
                                case 'null':
                                    cleanedValues[property] = null;
                                    break;
                            }
                        }
                        else {
                            const singleValue = Array.isArray(value) ? value[value.length - 1] : value;
                            cleanedValues[property] = singleValue === '1';
                        }
                    }
                }
                if (cleanedValues[property] === undefined) {
                    cleanedValues[property] = value;
                }
            }
            return cleanedValues;
        });
    }
};
DefaultAdminSite = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [typeorm_1.Connection,
        typeorm_1.EntityManager])
], DefaultAdminSite);
exports.default = DefaultAdminSite;
//# sourceMappingURL=adminSite.js.map