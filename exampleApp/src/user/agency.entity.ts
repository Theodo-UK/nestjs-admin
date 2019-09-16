import { Entity, Column, PrimaryGeneratedColumn, OneToMany, PrimaryColumn } from 'typeorm'
import { User } from './user.entity'

@Entity('agencies')
export class Agency extends Object {
  @PrimaryGeneratedColumn()
  id: number

  @PrimaryColumn({ default: 'UK' })
  country: string

  @Column({ length: 50 })
  name: string

  @OneToMany(type => User, user => user.agency)
  users: User[]

  toString() {
    if (this.name) {
      return `${this.id} - ${this.name}`
    }
    return this.id.toString()
  }
}
