import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class AdminFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}
