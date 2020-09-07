"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatting_1 = require("../utils/formatting");
class AdminSection {
    constructor(name) {
        this.name = name;
        this.entities = {};
    }
    register(adminEntity) {
        this.entities[formatting_1.parseName(adminEntity.name)] = adminEntity;
    }
    getAdminEntity(entityName) {
        const adminEntity = this.entities[entityName];
        if (!adminEntity)
            throw new Error(`Admin for "${entityName}" has not been registered`);
        return adminEntity;
    }
    getEntitiesMetadata() {
        return Object.values(this.entities).map(e => e.metadata);
    }
    getRepository(entityName) {
        const adminEntity = this.getAdminEntity(entityName);
        const repository = adminEntity.repository;
        if (!repository)
            throw new Error(`Repository for "${entityName}" does not exist`);
        return repository;
    }
}
exports.default = AdminSection;
//# sourceMappingURL=adminSection.js.map