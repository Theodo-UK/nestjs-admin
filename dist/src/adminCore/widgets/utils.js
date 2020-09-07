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
exports.getRelationOptions = exports.getDefaultWidget = void 0;
const textWidget_1 = require("./textWidget");
const integerWidget_1 = require("./integerWidget");
const textareaWidget_1 = require("./textareaWidget");
const arrayWidget_1 = require("./arrayWidget");
const decimalWidget_1 = require("./decimalWidget");
const dateWidget_1 = require("./dateWidget");
const booleanWidget_1 = require("./booleanWidget");
const foreignKeyWidget_1 = require("./foreignKeyWidget");
const timeWidget_1 = require("./timeWidget");
const datetimeWidget_1 = require("./datetimeWidget");
const passwordWidget_1 = require("./passwordWidget");
const enumWidget_1 = require("./enumWidget");
const typechecks_1 = require("../../utils/typechecks");
function getDefaultWidget(column, adminSite, entity) {
    const widgetArgs = [column, adminSite, entity];
    if (!!column.relationMetadata) {
        return new foreignKeyWidget_1.default(...widgetArgs);
    }
    if (['password', 'pw'].includes(column.propertyName)) {
        return new passwordWidget_1.default(...widgetArgs);
    }
    const type = column.type;
    switch (type) {
        case 'text':
        case 'mediumtext':
        case 'longtext':
        case 'ntext':
        case 'citext':
        case 'json':
        case 'jsonb':
        case 'simple-json':
            return new textareaWidget_1.default(...widgetArgs);
        case String:
        case 'tinytext':
        case 'uuid':
            return new textWidget_1.default(...widgetArgs);
        case 'simple-array':
        case 'simple_array':
            return new arrayWidget_1.default(...widgetArgs);
        case Number:
        case 'number':
        case 'integer':
        case 'tinyint':
        case 'smallint':
        case 'mediumint':
        case 'bigint':
        case 'int':
        case 'int2':
        case 'int4':
        case 'int8':
        case 'int64':
        case 'unsigned big int':
        case 'long':
            return new integerWidget_1.default(...widgetArgs);
        case 'numeric':
        case 'float':
        case 'dec':
        case 'decimal':
        case 'real':
        case 'double':
        case 'double precision':
        case 'fixed':
            return new decimalWidget_1.default(...widgetArgs);
        case 'date':
            return new dateWidget_1.default(...widgetArgs);
        case Date:
        case 'timestamp':
        case 'timestamp without time zone':
            return new datetimeWidget_1.default(...widgetArgs);
        case 'boolean':
        case 'bool':
            return new booleanWidget_1.default(...widgetArgs);
        case 'time':
        case 'time without time zone':
            return new timeWidget_1.default(...widgetArgs);
        case 'enum':
        case 'simple-enum':
            return new enumWidget_1.default(...widgetArgs);
        default:
            const guard = type;
            return new textWidget_1.default(...widgetArgs);
    }
}
exports.getDefaultWidget = getDefaultWidget;
function getRelationOptions(adminSite, relation, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!typechecks_1.isClass(relation.type)) {
            throw new Error(`${relation.type} is not an entity, it cannot be used as relation`);
        }
        const options = yield adminSite.entityManager.find(relation.type);
        cb(null, options);
    });
}
exports.getRelationOptions = getRelationOptions;
//# sourceMappingURL=utils.js.map