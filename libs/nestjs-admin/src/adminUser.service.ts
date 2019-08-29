import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/typeorm'
import { hashSync as bcryptHashSync, compareSync } from 'bcryptjs'
import { Connection, EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm'
import AdminUser from './adminUser.entity'

@Injectable()
export class AdminUserSubscriber implements EntitySubscriberInterface<AdminUser> {
  constructor(@InjectConnection() readonly connection: Connection) {
    connection.subscribers.push(this)
  }

  listenTo() {
    return AdminUser
  }

  hashString(password: string) {
    return bcryptHashSync(password, 12)
  }

  beforeInsert(event: InsertEvent<AdminUser>) {
    event.entity.password = this.hashString(event.entity.password)
  }
  beforeUpdate(event: UpdateEvent<AdminUser>) {
    const isPasswordUpdated = !compareSync(event.entity.password, event.databaseEntity.password)

    if (isPasswordUpdated) {
      event.entity.password = this.hashString(event.entity.password)
    } else {
      event.entity.password = event.databaseEntity.password
    }
  }
}
