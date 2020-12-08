#!/usr/bin/env ts-node

import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Command } from 'commander';
import { CliAdminModule } from './cliAdmin.module';
import { createAdminUser } from './createAdminUser';

async function execCommand(command: (app: INestApplicationContext) => any) {
  const app = await NestFactory.createApplicationContext(CliAdminModule.create());
  await command(app);
}

const program = new Command();
program
  .version('1.0.0')
  .command('createAdminUser')
  .description('creates an AdminUser by prompting for its credentials')
  .action(async () => await execCommand(createAdminUser));

program.parse(process.argv);

const NO_COMMAND_SPECIFIED = program.args.length === 0;
if (NO_COMMAND_SPECIFIED) {
  program.help();
}
