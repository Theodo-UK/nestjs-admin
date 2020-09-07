"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWidget = void 0;
class BaseWidget {
    constructor(column, adminSite, entity) {
        this.column = column;
        this.adminSite = adminSite;
        this.entity = entity;
    }
    getLabel() {
        return this.column.propertyName;
    }
    isRequired() {
        return !this.column.isNullable;
    }
    getValue() {
        if (!this.entity) {
            return null;
        }
        return this.column.getEntityValue(this.entity);
    }
}
exports.BaseWidget = BaseWidget;
//# sourceMappingURL=widget.interface.js.map