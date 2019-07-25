import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Agency } from './agency.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  name: string

  @Column({ length: 100 })
  password: string

  @Column({ length: 100 })
  email: string

  @Column('simple-array')
  roles: string[]

  @ManyToOne(type => Agency, agency => agency.users, { eager: true })
  agency: Agency
}
