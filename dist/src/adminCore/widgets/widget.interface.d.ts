import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import DefaultAdminSite from '../adminSite';
export interface WidgetConstructor {
    new (column: ColumnMetadata, adminSite: DefaultAdminSite, entity?: object): any;
}
export interface Widget {
    template: string;
}
export declare abstract class BaseWidget {
    readonly column: ColumnMetadata;
    readonly adminSite: DefaultAdminSite;
    readonly entity?: object;
    constructor(column: ColumnMetadata, adminSite: DefaultAdminSite, entity?: object);
    abstract template: string;
    getLabel(): string;
    isRequired(): boolean;
    getValue(): any;
}
