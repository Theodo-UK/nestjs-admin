import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as inquirer from 'inquirer'
import { AppModule } from '@/app.module'
import { AdminUserService } from '../adminUser.service'
import AdminUser from '../adminUser.entity'

describe('AdminUserService', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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
    await adminUserService.promptAndCreate()

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
    adminUserRepository.remove(adminUser)
    // @ts-ignore
    inquirer.prompt = promptBackup
  })
})
