import { AdminEntity, DefaultAdminSite, PasswordWidget } from 'nestjs-admin'
import { Request, Response } from 'express'
import { User } from './user.entity'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UserAdmin extends AdminEntity {
  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
    userAdminSite: DefaultAdminSite,
  ) {
    super(userAdminSite)
  }

  entity = User
  listDisplay = ['id', 'firstName', 'lastName', 'email', 'createdDate']
  searchFields = ['firstName', 'lastName', 'email']
  listActions = [{ label: 'Create random', action: this.createRandom }]

  widgets = {
    password: PasswordWidget,
  }

  async createRandom(request: Request, response: Response) {
    this.userRepository.save(new User())
    request.flash('messages', 'Successfully created')
  }
}
