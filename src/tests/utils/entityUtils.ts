import { User } from '../../../exampleApp/src/user/user.entity'
import AdminUser from '../../adminUser.entity'

export function createTestAdminUser(attrs: Partial<AdminUser> = {}): AdminUser {
  const user = new AdminUser()
  const defaultAttrs = {
    email: 'admin@email.com',
    password: 'adminpassword',
  }
  return Object.assign(user, { ...defaultAttrs, ...attrs })
}

export function createTestUser(attrs?: Partial<User>): User {
  const user = new User()
  const defaultAttrs = {
    firstName: 'Harry',
    lastName: 'Potter',
    isCool: true,
  }
  return Object.assign(user, { ...defaultAttrs, ...attrs })
}
