import { Connection } from 'typeorm'
import { EntityType } from './types'

class AdminEntity {
  constructor(public readonly entity: EntityType, private readonly connection: Connection) {}

  get repository() {
    return this.connection.getRepository(this.entity)
  }

  get metadata() {
    return this.repository.metadata
  }

  get name() {
    return this.metadata.name
  }
}

export default AdminEntity
