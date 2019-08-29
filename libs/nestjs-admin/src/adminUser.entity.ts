import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm'
import { hashSync as bcryptHashSync } from 'bcryptjs'

@Entity('adminUser')
class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50 })
  email: string

  @Column({ length: 128 })
  password: string

  toString() {
    if (this.email) {
      return `${this.id} - ${this.email}`
    }
    return this.id
  }

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcryptHashSync(this.password)
  }
}

export default AdminUser
