import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('adminUser')
class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50, unique: true, nullable: false })
  username: string

  @Column({ length: 128, nullable: false })
  password: string

  toString() {
    if (this.username) {
      return `${this.id} - ${this.username}`
    }
    return this.id
  }
}

export default AdminUser
