import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectRepository } from '@nestjs/typeorm'
import { hashSync as bcryptHashSync, compareSync } from 'bcryptjs'
import {
  Connection,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  Repository,
} from 'typeorm'
import { prompt } from 'inquirer'
import AdminUser from './adminUser.entity'

@Injectable()
export class AdminUserService implements EntitySubscriberInterface<AdminUser> {
  constructor(
    @InjectConnection() readonly connection: Connection,
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
  ) {
    connection.subscribers.push(this)
  }

  listenTo() {
    return AdminUser
  }

  hashPassword(password: string) {
    return bcryptHashSync(password, 12)
  }

  beforeInsert(event: InsertEvent<AdminUser>) {
    event.entity.password = this.hashPassword(event.entity.password)
  }
  beforeUpdate(event: UpdateEvent<AdminUser>) {
    const isPasswordUpdated = !compareSync(event.entity.password, event.databaseEntity.password)

    if (isPasswordUpdated) {
      event.entity.password = this.hashPassword(event.entity.password)
    } else {
      event.entity.password = event.databaseEntity.password
    }
  }

  async create(email: string, password: string) {
    const admin = new AdminUser()
    admin.email = email
    admin.password = password

    this.adminUserRepository.save(admin)
  }

  async promptAndCreate() {
    type Answers = {
      email: string
      password: string
    }

    const { email, password }: Answers = await prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Email:',
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password:',
      },
    ])

    await this.create(email, password)
  }
}
