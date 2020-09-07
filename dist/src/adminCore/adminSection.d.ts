import AdminEntity from './adminEntity';
declare class AdminSection {
    readonly name: string;
    entities: {
        [key: string]: AdminEntity;
    };
    constructor(name: string);
    register(adminEntity: AdminEntity): void;
    getAdminEntity(entityName: string): AdminEntity;
    getEntitiesMetadata(): import("typeorm").EntityMetadata[];
    getRepository(entityName: string): import("typeorm").Repository<unknown>;
}
export default AdminSection;
