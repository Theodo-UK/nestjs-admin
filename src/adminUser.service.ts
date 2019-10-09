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
import AdminUser from './adminUser.entity'
import { DuplicateUsernameException } from './exceptions/userAdmin.exception'
import { AdminUserValidationException } from './exceptions/adminUserValidation.exception'
import { AdminAuthenticatorInterface } from './adminAuthenticator.interface'

@Injectable()
export class AdminUserService
  implements AdminAuthenticatorInterface, EntitySubscriberInterface<AdminUser> {
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

  async create(username: string, password: string) {
    if (await this.adminUserRepository.findOne({ username })) {
      throw new DuplicateUsernameException(username)
    }

    if (!username || !password) {
      throw new AdminUserValidationException()
    }

    const admin = new AdminUser()
    admin.username = username
    admin.password = password

    await this.adminUserRepository.save(admin)
  }

  async findOne(username: string): Promise<AdminUser | undefined> {
    return await this.adminUserRepository.findOne({ where: { username } })
  }

  async validateAdminCredentials(username: string, pass: string) {
    const adminUser: AdminUser | null = await this.findOne(username)
    if (adminUser && this.comparePassword(adminUser, pass)) {
      // @debt quality "miker: 1/ is this destructure necessary? was copied from blog post
      // @debt quality "miker: 2/ https://dev.to/nestjs/authentication-and-sessions-for-mvc-apps-with-nestjs-55a4"
      const { password, ...result } = adminUser
      return result
    }
    return null
  }
}
