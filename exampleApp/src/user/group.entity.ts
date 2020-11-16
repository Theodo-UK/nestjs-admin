import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  name: string

  toString(): string {
    if (this.name) {
      return `${this.id} - ${this.name}`
    }
    return this.id.toString()
  }
}
