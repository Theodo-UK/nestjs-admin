import { Entity, Column, PrimaryGeneratedColumn, OneToMany, PrimaryColumn } from 'typeorm'

@Entity()
export class EntityWithCompositePrimaryKey extends Object {
  @PrimaryGeneratedColumn()
  id: number

  @PrimaryColumn({ default: 'UK' })
  country: string
}
