import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from '../../src/utils/typeormProxy'
import * as inquirer from 'inquirer'
import AdminUser from '../../src/adminUser.entity'
import { AdminUserService } from '../../src/adminUser.service'
import { CliAdminModule } from '../cliAdmin.module'
import { createAdminUser } from '../createAdminUser'

describe('createAdminUser', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CliAdminModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('prompts for answers and creates an AdminUser', async () => {
    const answers = { email: 'some@example.com', password: 'somepassword' }

    // Mock inquirer's prompt
    const promptBackup = inquirer.prompt
    // @ts-ignore
    inquirer.prompt = jest.fn().mockResolvedValue(answers)

    const adminUserRepository: Repository<AdminUser> = app.get(getRepositoryToken(AdminUser))
    const adminUserService = app.get(AdminUserService)
    await createAdminUser(app)

    expect(inquirer.prompt).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'email' }),
        expect.objectContaining({ name: 'password' }),
      ]),
    )

    const adminUser = await adminUserRepository.findOneOrFail({ email: answers.email })
    expect(adminUser).toBeDefined()
    expect(adminUserService.comparePassword(adminUser, answers.password)).toBe(true)

    // Restore initial state
    await adminUserRepository.remove(adminUser)
    // @ts-ignore
    inquirer.prompt = promptBackup
  })
})
