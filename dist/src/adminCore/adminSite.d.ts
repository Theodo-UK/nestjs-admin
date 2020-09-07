import { Connection, EntityMetadata, EntityManager } from 'typeorm';
import AdminSection from './adminSection';
import { EntityType } from '../types';
import AdminEntity from './adminEntity';
declare class DefaultAdminSite {
    private readonly connection;
    readonly entityManager: EntityManager;
    siteHeader: string;
    defaultDateFormat: string;
    constructor(connection: Connection, entityManager: EntityManager);
    sections: {
        [sectionName: string]: AdminSection;
    };
    private getOrCreateSection;
    register(sectionName: string, adminEntity: EntityType | typeof AdminEntity): void;
    getEntityList(adminEntity: AdminEntity, page: number, searchSting: string): Promise<{
        entities: unknown[];
        count: number;
    }>;
    getSectionList(): AdminSection[];
    getSection(sectionName: string): AdminSection;
    getRepository(entity: EntityType): import("typeorm").Repository<unknown>;
    getEntityMetadata(entity: EntityType): EntityMetadata;
    cleanValues(values: {
        [k: string]: any;
    }, metadata: EntityMetadata): Promise<{
        [k: string]: any;
    }>;
}
export default DefaultAdminSite;
