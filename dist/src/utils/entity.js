"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEntityInList = exports.getPrimaryKeyValue = void 0;
function getPrimaryKeyValue(metadata, entity) {
    return metadata.getEntityIdMixedMap(entity);
}
exports.getPrimaryKeyValue = getPrimaryKeyValue;
function isEntityInList(entity, array, metadata) {
    if (!array || !entity)
        return false;
    const idCols = metadata.primaryColumns.map(col => col.propertyName);
    return (array.findIndex(item => idCols.every(idCol => item[idCol] === entity[idCol])) !== -1);
}
exports.isEntityInList = isEntityInList;
//# sourceMappingURL=entity.js.map