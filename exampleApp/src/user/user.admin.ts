import { AdminEntity, PasswordWidget } from 'nestjs-admin'
import { User } from './user.entity'

export class UserAdmin extends AdminEntity {
  entity = User
  listDisplay = ['id', 'firstName', 'lastName', 'email', 'createdDate']
  searchFields = ['firstName', 'lastName', 'email', 'description']

  widgets = {
    password: PasswordWidget,
  }
}
