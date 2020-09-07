import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import AdminSite from '../adminSite';
import { Widget } from './widget.interface';
import DefaultAdminSite from '../adminSite';
export declare function getDefaultWidget(column: ColumnMetadata, adminSite: DefaultAdminSite, entity?: object): Widget;
export declare function getRelationOptions(adminSite: AdminSite, relation: RelationMetadata, cb: any): Promise<void>;
