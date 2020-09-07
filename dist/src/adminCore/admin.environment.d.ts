import * as nunjucks from 'nunjucks';
import { Request } from 'express';
import DefaultAdminSite from './adminSite';
interface TemplateParameters {
    request: Request;
    [k: string]: any;
}
declare class DefaultAdminNunjucksEnvironment {
    private adminSite;
    env: nunjucks.Environment;
    constructor(adminSite: DefaultAdminSite);
    render(name: string, parameters: TemplateParameters): Promise<unknown>;
}
export default DefaultAdminNunjucksEnvironment;
