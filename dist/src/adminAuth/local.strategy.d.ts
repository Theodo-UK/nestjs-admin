import { Strategy } from 'passport-local';
import { CredentialValidator } from './adminAuth.module';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly credentialValidator;
    constructor(credentialValidator: CredentialValidator);
    validate(username: string, password: string): Promise<object>;
}
export {};
