"use strict";
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
const typeormProxy_1 = require("../utils/typeormProxy");
const utils_1 = require("./widgets/utils");
const manyToManyWidget_1 = require("./widgets/manyToManyWidget");
const invalidDisplayFields_exception_1 = require("./exceptions/invalidDisplayFields.exception");
class AdminEntity {
    constructor(adminSite, connection) {
        this.adminSite = adminSite;
        this.connection = connection;
        this.listDisplay = null;
        this.searchFields = null;
        this.resultsPerPage = 25;
        this.widgets = {};
    }
    get repository() {
        return this.connection.getRepository(this.entity);
    }
    get metadata() {
        return this.repository.metadata;
    }
    get name() {
        return this.metadata.name;
    }
    getFields(form) {
        return [
            ...this.metadata.columns.map(column => column.propertyName),
            ...this.metadata.manyToManyRelations.map(relation => relation.propertyName),
        ];
    }
    getWidgets(form, entity) {
        const fields = this.getFields(form);
        const widgets = fields
            .filter(field => this.metadata.columns.map(column => column.propertyName).includes(field))
            .filter(field => {
            const column = this.metadata.findColumnWithPropertyName(field);
            return !(form === 'add' && column.isGenerated);
        })
            .map(field => {
            const column = this.metadata.findColumnWithPropertyName(field);
            if (this.widgets[field]) {
                return new this.widgets[field](column, this.adminSite, entity);
            }
            else {
                return utils_1.getDefaultWidget(column, this.adminSite, entity);
            }
        });
        const manyToManyWidgets = fields
            .filter(field => !this.metadata.columns.map(column => column.propertyName).includes(field))
            .map(field => {
            const relation = this.metadata.findRelationWithPropertyPath(field);
            return new manyToManyWidget_1.default(relation, this.adminSite, entity);
        });
        return [...widgets, ...manyToManyWidgets];
    }
    validateListConfig() {
        this.validateDisplayFields();
        this.validateSearchFields();
    }
    validateDisplayFields() {
        validateFieldsExist(this, 'listDisplay', this.metadata);
        validateFieldsAreNotRelation(this, 'listDisplay', this.metadata);
    }
    validateSearchFields() {
        validateFieldsExist(this, 'searchFields', this.metadata);
        validateFieldsAreNotRelation(this, 'searchFields', this.metadata);
    }
    buildSearchQueryOptions(query, alias, searchParam) {
        if (searchParam && this.searchFields) {
            const searchArray = searchParam.split(' ');
            searchArray.forEach((searchTerm, searchTermIndex) => query.andWhere(new typeormProxy_1.Brackets((qb) => {
                this.searchFields.forEach((field, fieldIndex) => {
                    const paramString = `searchTerm${searchTermIndex}Field${fieldIndex}`;
                    qb.orWhere(`${alias}.${field} LIKE :${paramString}`, {
                        [paramString]: `%${searchTerm}%`,
                    });
                });
                return qb;
            })));
        }
        return query;
    }
    buildPaginationQueryOptions(query, page) {
        query.skip(this.resultsPerPage * (page - 1)).take(this.resultsPerPage);
        return query;
    }
    getEntityList(page, searchString) {
        return __awaiter(this, void 0, void 0, function* () {
            const alias = this.name;
            let query = this.adminSite.entityManager.createQueryBuilder(this.entity, alias);
            query = this.buildPaginationQueryOptions(query, page);
            query = this.buildSearchQueryOptions(query, alias, searchString);
            const [entities, count] = yield query.getManyAndCount();
            return { entities, count };
        });
    }
}
function validateFieldsExist(adminEntity, configField, metadata) {
    const fieldsList = adminEntity[configField];
    if (!fieldsList)
        return;
    fieldsList.forEach(field => {
        if (!metadata.columns.map(column => column.propertyName).includes(field)) {
            throw new invalidDisplayFields_exception_1.InvalidDisplayFieldsException(`Property ${field} invalid in ${configField}: does not exist on ${metadata.name}.`);
        }
    });
}
function validateFieldsAreNotRelation(adminEntity, configField, metadata) {
    const fieldsList = adminEntity[configField];
    if (!fieldsList)
        return;
    fieldsList.forEach(field => {
        const relation = metadata.findRelationWithPropertyPath(field);
        if (relation) {
            throw new invalidDisplayFields_exception_1.InvalidDisplayFieldsException(`Property ${field} on ${metadata.name} invalid in ${configField}: relations are not supported for displaying.`);
        }
    });
    if (!adminEntity.listDisplay)
        return;
    adminEntity.listDisplay.forEach(field => {
        if (!metadata.columns.map(column => column.propertyName).includes(field)) {
            throw new invalidDisplayFields_exception_1.InvalidDisplayFieldsException(`Property ${field} invalid in listDisplay: does not exist on ${metadata.name}.`);
        }
        const relation = metadata.findRelationWithPropertyPath(field);
        if (relation) {
            throw new invalidDisplayFields_exception_1.InvalidDisplayFieldsException(`Property ${field} on ${metadata.name} invalid in listDisplay: relations are not supported for displaying.`);
        }
    });
}
exports.default = AdminEntity;
//# sourceMappingURL=adminEntity.js.map