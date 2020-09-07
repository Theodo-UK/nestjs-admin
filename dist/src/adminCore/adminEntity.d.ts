import { Connection, EntityMetadata, SelectQueryBuilder } from '../utils/typeormProxy';
import { EntityType } from '../types';
import DefaultAdminSite from './adminSite';
import { WidgetConstructor } from './widgets/widget.interface';
declare abstract class AdminEntity {
    private readonly adminSite;
    private readonly connection;
    abstract entity: EntityType;
    listDisplay: string[] | null;
    searchFields: string[] | null;
    resultsPerPage: number;
    widgets: {
        [propertyName: string]: WidgetConstructor;
    };
    constructor(adminSite: DefaultAdminSite, connection: Connection);
    get repository(): import("typeorm").Repository<unknown>;
    get metadata(): EntityMetadata;
    get name(): string;
    getFields(form: 'add' | 'change'): string[];
    getWidgets(form: 'add' | 'change', entity?: object): any[];
    validateListConfig(): void;
    private validateDisplayFields;
    private validateSearchFields;
    protected buildSearchQueryOptions(query: SelectQueryBuilder<unknown>, alias: string, searchParam: string): SelectQueryBuilder<unknown>;
    protected buildPaginationQueryOptions(query: SelectQueryBuilder<unknown>, page: number): SelectQueryBuilder<unknown>;
    getEntityList(page: number, searchString: string): Promise<{
        entities: unknown[];
        count: number;
    }>;
}
export default AdminEntity;
