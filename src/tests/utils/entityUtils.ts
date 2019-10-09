import * as faker from 'faker'
import { User } from '../../../exampleApp/src/user/user.entity'
import AdminUser from '../../adminUser.entity'

faker.seed(1232) // random, but consistent between executions

export function createTestAdminUser(attrs: Partial<AdminUser> = {}): AdminUser {
  const user = new AdminUser()
  const defaultAttrs = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  }
  return Object.assign(user, { ...defaultAttrs, ...attrs })
}

export function createTestUser(attrs?: Partial<User>): User {
  const user = new User()
  const defaultAttrs = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    isCool: faker.random.boolean(),
  }
  return Object.assign(user, { ...defaultAttrs, ...attrs })
}
