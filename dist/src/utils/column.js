"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnumType = exports.isBooleanType = exports.isDateType = exports.isNumberType = exports.isDecimalType = exports.isIntegerType = void 0;
function isIntegerType(type) {
    return [
        Number,
        'number',
        'integer',
        'tinyint',
        'smallint',
        'mediumint',
        'bigint',
        'int',
        'int2',
        'int4',
        'int8',
        'int64',
        'unsigned big int',
        'long',
    ].includes(type);
}
exports.isIntegerType = isIntegerType;
function isDecimalType(type) {
    return [
        'numeric',
        'float',
        'dec',
        'decimal',
        'real',
        'double',
        'double precision',
        'fixed',
    ].includes(type);
}
exports.isDecimalType = isDecimalType;
function isNumberType(type) {
    return isDecimalType(type) || isIntegerType(type);
}
exports.isNumberType = isNumberType;
function isDateType(type) {
    return [
        Date,
        'date',
        'datetime',
        'datetime2',
        'datetimeoffset',
        'time',
        'time with time zone',
        'time without time zone',
        'timestamp',
        'timestamp without time zone',
        'timestamp with time zone',
        'timestamp with local time zone',
    ].includes(type);
}
exports.isDateType = isDateType;
function isBooleanType(type) {
    return [
        Boolean,
        'boolean',
        'bool',
    ].includes(type);
}
exports.isBooleanType = isBooleanType;
function isEnumType(type) {
    return [
        'enum',
        'simple-enum',
    ].includes(type);
}
exports.isEnumType = isEnumType;
//# sourceMappingURL=column.js.map