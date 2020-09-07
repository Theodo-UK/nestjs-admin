import { EntitySubscriberInterface, InsertEvent, UpdateEvent, EntityManager } from 'typeorm';
import { Connection } from '../utils/typeormProxy';
import AdminUser from './adminUser.entity';
export declare class AdminUserService implements EntitySubscriberInterface<AdminUser> {
    readonly connection: Connection;
    private readonly entityManager;
    constructor(connection: Connection, entityManager: EntityManager);
    listenTo(): typeof AdminUser;
    hashPassword(password: string): string;
    comparePassword(adminUser: AdminUser, password: string): boolean;
    beforeInsert(event: InsertEvent<AdminUser>): void;
    beforeUpdate(event: UpdateEvent<AdminUser>): void;
    create(username: string, password: string): Promise<void>;
    findOne(username: string): Promise<AdminUser | undefined>;
    validateAdminCredentials(username: string, password: string): Promise<{
        id: string;
        username: string;
    }>;
}
