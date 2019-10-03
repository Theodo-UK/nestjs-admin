import { AdminEntity, PasswordWidget } from 'nestjs-admin'
import { User } from './user.entity'

export class UserAdmin extends AdminEntity {
  newAction = () => console.log('hello')
  entity = User
  listDisplay = ['id', 'firstName', 'lastName', 'email', 'createdDate']
  searchFields = ['firstName', 'lastName', 'email', 'description']
  listActions = [{ label: 'NEW BUTTON', action: this.newAction }]

  widgets = {
    password: PasswordWidget,
  }
}
