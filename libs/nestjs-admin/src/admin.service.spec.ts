import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, HttpModule } from '@nestjs/common'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import * as request from 'supertest'
import { Repository } from 'typeorm'
import { User } from '../../../src/user/user.entity'
import { AppModule } from '../../../src/app.module'

describe('AdminSite', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()
  })

  it('should be defined', () => {
    expect(app).toBeDefined()
  })

  it('can delete a user', async () => {
    // add the user to the database
    const userData = { firstName: 'Max' }
    const userRepository: Repository<User> = app.get(getRepositoryToken(User))
    const user = await userRepository.save(userData)
    expect(await userRepository.findOneOrFail(user.id)).toBeDefined()

    // delete the user via the api call
    const server = app.getHttpServer()
    const res = await request(server)
      .post(`/admin/user/user/${user.id}/delete`)
      .expect(302)

    expect(await userRepository.findOne(user.id)).toBeUndefined()
  })
})
