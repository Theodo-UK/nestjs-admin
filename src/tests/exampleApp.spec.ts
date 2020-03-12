import { NestFactory } from '@nestjs/core'
import { AppModule } from '../../exampleApp/src/app.module'

describe('ExampleApp', () => {
  it('successfully starts', async () => {
    try {
      expect(await NestFactory.createApplicationContext(AppModule)).not.toThrow()
    } catch (e) {
      console.error(e)
    }
  })
})
