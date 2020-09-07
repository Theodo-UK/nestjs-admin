#!/usr/bin/env ts-node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const commander_1 = require("commander");
const cliAdmin_module_1 = require("./cliAdmin.module");
const createAdminUser_1 = require("./createAdminUser");
function execCommand(command) {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.createApplicationContext(cliAdmin_module_1.CliAdminModule.create());
        yield command(app);
    });
}
const program = new commander_1.Command();
program
    .version('1.0.0')
    .command('createAdminUser')
    .description('creates an AdminUser by prompting for its credentials')
    .action(() => __awaiter(void 0, void 0, void 0, function* () { return yield execCommand(createAdminUser_1.createAdminUser); }));
program.parse(process.argv);
const NO_COMMAND_SPECIFIED = program.args.length === 0;
if (NO_COMMAND_SPECIFIED) {
    program.help();
}
//# sourceMappingURL=cli.js.map