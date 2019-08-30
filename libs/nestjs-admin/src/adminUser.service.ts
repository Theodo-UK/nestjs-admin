import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/typeorm'
import { hashSync as bcryptHashSync, compareSync } from 'bcryptjs'
import { Connection, EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm'
import AdminUser from './adminUser.entity'

@Injectable()
export class AdminUserService implements EntitySubscriberInterface<AdminUser> {
  constructor(@InjectConnection() readonly connection: Connection) {
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
}
