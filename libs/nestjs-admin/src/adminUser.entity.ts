import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
}

export default AdminUser
