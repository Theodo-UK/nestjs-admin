import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/typeorm'
import { hashSync as bcryptHashSync, compareSync } from 'bcryptjs'
import { EntitySubscriberInterface, InsertEvent, UpdateEvent, EntityManager } from 'typeorm'
import { Connection } from './utils/typeormProxy'
import AdminUser from './adminUser.entity'
import { DuplicateEmailException } from './exceptions/userAdmin.exception'
import { AdminUserValidationException } from './exceptions/adminUserValidation.exception'

@Injectable()
export class AdminUserService implements EntitySubscriberInterface<AdminUser> {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly entityManager: EntityManager,
  ) {
    connection.subscribers.push(this)
  }

  listenTo() {
    return AdminUser
  }

  hashPassword(password: string) {
    return bcryptHashSync(password, 12)
  }

  /**
   * Returns true if `password` is the `adminUser`'s password, false otherwise
   */
  comparePassword(adminUser: AdminUser, password: string) {
    return compareSync(password, adminUser.password)
  }

  beforeInsert(event: InsertEvent<AdminUser>) {
    event.entity.password = this.hashPassword(event.entity.password)
  }
  beforeUpdate(event: UpdateEvent<AdminUser>) {
    // @debt TODO "To be tested"
    if (!event.entity || !event.databaseEntity) return

    const isPasswordUpdated = !this.comparePassword(event.entity, event.databaseEntity.password)

    if (isPasswordUpdated) {
      event.entity.password = this.hashPassword(event.entity.password)
    } else {
      event.entity.password = event.databaseEntity.password
    }
  }

  async create(email: string, password: string) {
    if (await this.entityManager.findOne(AdminUser, { email })) {
      throw new DuplicateEmailException(email)
    }

    if (!email || !password) {
      throw new AdminUserValidationException()
    }

    const admin = new AdminUser()
    admin.email = email
    admin.password = password

    await this.entityManager.save(admin)
  }

  async findOne(email: string): Promise<AdminUser | undefined> {
    return await this.entityManager.findOne(AdminUser, { where: { email } })
  }

  async validateCredentials(email: string, pass: string) {
    const adminUser = await this.findOne(email)
    if (adminUser && this.comparePassword(adminUser, pass)) {
      // @debt quality "miker: 1/ is this destructure necessary? was copied from blog post
      // @debt quality "miker: 2/ https://dev.to/nestjs/authentication-and-sessions-for-mvc-apps-with-nestjs-55a4"
      const { password, ...result } = adminUser
      return result
    }
    return null
  }
}
