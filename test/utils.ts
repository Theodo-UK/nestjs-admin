import { User } from '@/user/user.entity'

export function createTestUser(attrs?: Partial<User>): User {
  const user = new User()
  const defaultAttrs = {
    firstName: 'Harry',
    lastName: 'Potter',
    isCool: true,
  }
  return Object.assign(user, { ...defaultAttrs, ...attrs })
}
