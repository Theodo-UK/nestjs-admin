import { EntityMetadata, EntityManager } from 'typeorm';
import * as express from 'express';
import DefaultAdminSite from './adminSite';
import DefaultAdminSection from './adminSection';
import DefaultAdminNunjucksEnvironment from './admin.environment';
import AdminEntity from './adminEntity';
import { Request } from 'express';
declare type AdminModelsQuery = {
    sectionName?: string;
    entityName?: string;
    primaryKey?: string;
};
declare type AdminModelsResult = {
    section: DefaultAdminSection;
    adminEntity: AdminEntity;
    metadata: EntityMetadata;
    entity: object;
};
export declare class DefaultAdminController {
    private adminSite;
    private env;
    private entityManager;
    constructor(adminSite: DefaultAdminSite, env: DefaultAdminNunjucksEnvironment, entityManager: EntityManager);
    getEntityWithRelations(adminEntity: AdminEntity, primaryKey: any): Promise<object>;
    getAdminModels(query: AdminModelsQuery): Promise<AdminModelsResult>;
    index(request: Request): Promise<unknown>;
    changeList(request: Request, params: AdminModelsQuery, pageParam: string, searchString: string): Promise<unknown>;
    add(request: Request, params: AdminModelsQuery): Promise<unknown>;
    create(request: Request, createEntityDto: object, params: AdminModelsQuery, response: express.Response): Promise<void>;
    change(request: Request, params: AdminModelsQuery): Promise<unknown>;
    update(request: Request, updateEntityDto: object, params: AdminModelsQuery, response: express.Response): Promise<void>;
    delete(request: Request, params: AdminModelsQuery, response: express.Response): Promise<void>;
}
export {};
