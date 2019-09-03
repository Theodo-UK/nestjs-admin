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
import { DuplicateEmailException } from './exceptions/userAdmin.exception'

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
    const isPasswordUpdated = !this.comparePassword(event.entity, event.databaseEntity.password)

    if (isPasswordUpdated) {
      event.entity.password = this.hashPassword(event.entity.password)
    } else {
      event.entity.password = event.databaseEntity.password
    }
  }

  async create(email: string, password: string) {
    if (await this.adminUserRepository.findOne({ email })) {
      throw new DuplicateEmailException(email)
    }

    const admin = new AdminUser()
    admin.email = email
    admin.password = password

    await this.adminUserRepository.save(admin)
  }

  async findOne(email: string): Promise<AdminUser | undefined> {
    return await this.adminUserRepository.findOne({ where: { email } })
  }

  async validateCredentials(email: string, password: string) {
    const adminUser = await this.findOne(email)
    if (adminUser && this.comparePassword(adminUser, password)) {
      // @debt quality "miker: is this destructure necessary? was copied from blog post"
      const { password, ...result } = adminUser
      return result
    }
    return null
  }
}
