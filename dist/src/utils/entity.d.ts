import { EntityMetadata } from './typeormProxy';
import { EntityType } from '../types';
export declare function getPrimaryKeyValue(metadata: EntityMetadata, entity: object): import("typeorm").ObjectLiteral;
export declare function isEntityInList(entity: EntityType, array: EntityType[], metadata: EntityMetadata): boolean;
