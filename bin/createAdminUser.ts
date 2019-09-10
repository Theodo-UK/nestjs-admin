import { INestApplicationContext } from '@nestjs/common'
import { prompt } from 'inquirer'
import { AdminUserService } from '../src/adminUser.service'

export async function createAdminUser(app: INestApplicationContext) {
  const adminUserService = app.get(AdminUserService)

  type Answers = {
    email: string
    password: string
  }

  const { email, password }: Answers = await prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Email:',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password:',
    },
  ])

  await adminUserService.create(email, password)
}
