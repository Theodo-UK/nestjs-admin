import { User } from '../../../exampleApp/src/user/user.entity'
import AdminUser from '../../adminUser.entity'
import { Group } from '../../../exampleApp/src/user/group.entity'

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
export function createTestGroup(attrs?: Partial<Group>): Group {
  const group = new Group()
  const defaultAttrs = {
    Name: 'Harry Potter',
    id: 1997,
  }
  return Object.assign(group, { ...defaultAttrs, ...attrs })
}
