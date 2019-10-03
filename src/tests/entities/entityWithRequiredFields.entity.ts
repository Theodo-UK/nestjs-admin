import { Entity, Column, PrimaryGeneratedColumn } from '../../utils/typeormSwitch'

enum TestEnum {
  first = 'first',
  second = 'second',
  third = 'third',
}

@Entity('dummyentities')
export class EntityWithRequiredFields {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  requiredString: string

  @Column('enum', { enum: TestEnum })
  requiredEnum: TestEnum

  @Column({ length: 50, nullable: true })
  nullableString: string

  @Column('enum', { enum: TestEnum, nullable: true })
  nullableEnum: TestEnum
}
