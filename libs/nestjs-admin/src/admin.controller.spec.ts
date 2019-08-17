import { Test, TestingModule } from '@nestjs/testing'
import { DefaultAdminController } from './admin.controller'

describe('Admin Controller', () => {
  let controller: DefaultAdminController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefaultAdminController],
    }).compile()

    controller = module.get<DefaultAdminController>(DefaultAdminController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
