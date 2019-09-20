import { AdminEntity } from 'nestjs-admin'
import { User } from './user.entity'

export class UserAdmin extends AdminEntity {
  entity = User
  listDisplay = ['email', 'description']
  searchFields = ['firstName', 'lastName', 'email', 'description']
}
