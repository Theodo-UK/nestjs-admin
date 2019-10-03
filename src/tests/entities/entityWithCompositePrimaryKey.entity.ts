import { Entity, PrimaryGeneratedColumn, PrimaryColumn } from '../../utils/typeormProxy'

@Entity()
export class EntityWithCompositePrimaryKey extends Object {
  @PrimaryGeneratedColumn()
  id: number

  @PrimaryColumn({ default: 'UK' })
  country: string
}
