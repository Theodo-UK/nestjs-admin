import * as session from 'express-session';
import { DeepPartial } from 'typeorm';
export declare const publicFolder: string;
export interface AdminAppConfigurationOptions {
    session: session.SessionOptions;
    assetPrefix: string;
    serializeUser: (user: any, done: (err: any, id?: any) => void) => void;
    deserializeUser: (payload: any, done: (err: Error, payload: string) => void) => void;
}
export declare const defaultAdminConfigurationOptions: AdminAppConfigurationOptions;
export declare function createAppConfiguration(userConfig: DeepPartial<AdminAppConfigurationOptions>): AdminAppConfigurationOptions;
