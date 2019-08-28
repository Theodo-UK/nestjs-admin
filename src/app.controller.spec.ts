import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should return a link to the admin', () => {
      expect(appController.getHello()).toBe(
        'Hey you! You probably want to head to <a href="/admin">/admin</a>',
      )
    })
  })
})
