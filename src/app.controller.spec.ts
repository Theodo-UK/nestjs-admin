import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as request from 'supertest'
import { AppModule } from './app.module'
import { Repository } from 'typeorm'
import { User } from './user/user.entity'

describe('AppController', () => {
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
    const req = await request(server).post(`/admin/user/user/${user.id}/delete`)
    expect(req.status).toBe(302)
    expect(req.header.location).toBe(`/admin/user/user`)

    expect(await userRepository.findOne(user.id)).toBeUndefined()
  })
})
