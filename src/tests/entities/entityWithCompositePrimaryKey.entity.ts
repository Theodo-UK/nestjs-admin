import { Entity, PrimaryGeneratedColumn, PrimaryColumn } from '../../../src/utils/typeormSwitch'

@Entity()
export class EntityWithCompositePrimaryKey extends Object {
  @PrimaryGeneratedColumn()
  id: number

  @PrimaryColumn({ default: 'UK' })
  country: string
}
