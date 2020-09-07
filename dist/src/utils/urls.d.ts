import { EntityMetadata } from './typeormProxy';
import AdminSection from '../adminCore/adminSection';
export declare function indexUrl(): string;
export declare function loginUrl(): string;
export declare function logoutUrl(): string;
export declare function changeListUrl(section: AdminSection, metadata: EntityMetadata): string;
export declare function changeUrl(section: AdminSection, metadata: EntityMetadata, entity: object): string;
export declare function deleteUrl(section: AdminSection, metadata: EntityMetadata, entity: object): string;
export declare function addUrl(section: AdminSection, metadata: EntityMetadata): string;
