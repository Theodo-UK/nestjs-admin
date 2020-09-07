import { EntityMetadata } from '../utils/typeormProxy';
declare type Route = 'index' | 'changelist' | 'change' | 'add' | 'delete' | 'login' | 'logout';
declare type RouteArgs = string[];
export declare function adminUrl(route: Route, ...args: RouteArgs): string;
export declare function displayName(entity: object, metadata: EntityMetadata): string;
export declare function prettyPrint(name: string): string;
export {};
