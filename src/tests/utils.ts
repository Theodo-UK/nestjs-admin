import AdminUser from '../adminUser.entity'

export function createTestAdminUser(attrs: Partial<AdminUser> = {}): AdminUser {
  const user = new AdminUser()
  const defaultAttrs = {
    email: 'admin@email.com',
    password: 'adminpassword',
  }
  return Object.assign(user, { ...defaultAttrs, ...attrs })
}
