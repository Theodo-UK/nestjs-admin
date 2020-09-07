"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isClass = exports.isFunction = void 0;
function isFunction(maybeFunction) {
    return typeof maybeFunction === 'function';
}
exports.isFunction = isFunction;
function isClass(maybeClass) {
    return isFunction(maybeClass) && !!maybeClass.constructor;
}
exports.isClass = isClass;
//# sourceMappingURL=typechecks.js.map