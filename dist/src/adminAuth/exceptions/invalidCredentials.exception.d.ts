import { HttpException } from '@nestjs/common';
declare class InvalidCredentials extends HttpException {
    readonly username: string;
    constructor(username: string);
}
export default InvalidCredentials;
