"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ManyToManyWidget {
    constructor(relation, adminSite, entity) {
        this.relation = relation;
        this.adminSite = adminSite;
        this.entity = entity;
        this.template = 'widgets/manytomany.njk';
    }
    getLabel() {
        return this.relation.propertyName;
    }
    isRequired() {
        return !this.relation.isNullable;
    }
    getValue() {
        if (!this.entity) {
            return null;
        }
        return this.relation.getEntityValue(this.entity);
    }
}
exports.default = ManyToManyWidget;
//# sourceMappingURL=manyToManyWidget.js.map