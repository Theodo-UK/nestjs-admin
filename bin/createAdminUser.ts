import { INestApplicationContext } from '@nestjs/common';
import { prompt } from 'inquirer';
import { AdminUserService } from '../src/adminUser/adminUser.service';

export async function createAdminUser(app: INestApplicationContext) {
  const adminUserService = app.get(AdminUserService);

  type Answers = {
    username: string;
    password: string;
  };

  const { username, password }: Answers = await prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Username:',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password:',
    },
  ]);

  await adminUserService.create(username, password);
}
