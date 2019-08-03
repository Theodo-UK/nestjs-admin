import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Agency } from './agency.entity'

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50, nullable: true })
  firstName: string

  @Column({ length: 50, nullable: true })
  lastName: string

  @Column({ length: 100, nullable: true })
  password: string

  @Column({ length: 100, nullable: true })
  email: string

  @Column('simple-array', { nullable: true })
  roles: string[]

  @Column('text', { nullable: true })
  description: string

  @ManyToOne(type => Agency, agency => agency.users, { eager: true })
  agency: Agency

  @Column({ nullable: true })
  weight: number

  @Column('integer', { nullable: true })
  age: number

  @Column('int', { nullable: true })
  numberOfSiblings: number

  @Column('smallint', { nullable: true })
  fingerCount: number

  @Column('bigint', { nullable: true })
  atomCount: number

  @Column('float', { nullable: true })
  height: number

  @Column('decimal', { nullable: true })
  bmi: number

  @Column({ nullable: true })
  birthdate: Date

  @Column('date', { nullable: true })
  deathdate: Date

  @Column('time', { nullable: true })
  birthtime: Date

  @Column('boolean', { nullable: true })
  isActive: boolean

  @Column('json', { nullable: true })
  additionalData: any

  @Column('enum', { enum: Gender, nullable: true })
  gender: Gender

  @CreateDateColumn()
  createdDate: Date

  @UpdateDateColumn()
  updatedDate: Date
}
