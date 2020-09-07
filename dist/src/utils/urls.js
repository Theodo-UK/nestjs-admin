"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUrl = exports.deleteUrl = exports.changeUrl = exports.changeListUrl = exports.logoutUrl = exports.loginUrl = exports.indexUrl = void 0;
const formatting_1 = require("./formatting");
const entity_1 = require("./entity");
function indexUrl() {
    return `/admin`;
}
exports.indexUrl = indexUrl;
function loginUrl() {
    return `/admin/login`;
}
exports.loginUrl = loginUrl;
function logoutUrl() {
    return `/admin/logout`;
}
exports.logoutUrl = logoutUrl;
function changeListUrl(section, metadata) {
    return `/admin/${formatting_1.parseName(section.name)}/${formatting_1.parseName(metadata.name)}`;
}
exports.changeListUrl = changeListUrl;
function changeUrl(section, metadata, entity) {
    const primaryKey = urlEncodePrimaryKey(entity_1.getPrimaryKeyValue(metadata, entity));
    return `/admin/${formatting_1.parseName(section.name)}/${formatting_1.parseName(metadata.name)}/${primaryKey}/change`;
}
exports.changeUrl = changeUrl;
function deleteUrl(section, metadata, entity) {
    const primaryKey = urlEncodePrimaryKey(entity_1.getPrimaryKeyValue(metadata, entity));
    return `/admin/${formatting_1.parseName(section.name)}/${formatting_1.parseName(metadata.name)}/${primaryKey}/delete`;
}
exports.deleteUrl = deleteUrl;
function addUrl(section, metadata) {
    return `/admin/${formatting_1.parseName(section.name)}/${formatting_1.parseName(metadata.name)}/add`;
}
exports.addUrl = addUrl;
function urlEncodePrimaryKey(primaryKey) {
    return encodeURIComponent(JSON.stringify(primaryKey));
}
//# sourceMappingURL=urls.js.map