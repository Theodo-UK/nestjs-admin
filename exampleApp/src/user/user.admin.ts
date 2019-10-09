import { AdminEntity, PasswordWidget } from 'nestjs-admin'
import { User } from './user.entity'
import { Request, Response } from 'express'

export class UserAdmin extends AdminEntity {
  entity = User
  listDisplay = ['id', 'firstName', 'lastName', 'email', 'createdDate']
  listActions = [{ label: 'Create random', action: this.createRandom }]

  widgets = {
    password: PasswordWidget,
  }

  createRandom(request: Request, response: Response) {
    request.flash('messages', 'Successfully created')
  }
}
