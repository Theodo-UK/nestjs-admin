import { Test, TestingModule } from '@nestjs/testing'
import AdminSite from './adminSite'

describe('AdminSite', () => {
  let service: AdminSite

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminSite],
    }).compile()

    service = module.get<AdminSite>(AdminSite)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
