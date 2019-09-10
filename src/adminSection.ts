import { Connection } from 'typeorm'
import { parseName } from './utils/formatting'
import { EntityType } from './types'
import AdminEntity from './adminEntity'

class AdminSection {
  entities: { [key: string]: AdminEntity } = {}
  constructor(public readonly name: string, private readonly connection: Connection) {}

  register(entity: EntityType) {
    const adminEntity = new AdminEntity(entity, this.connection)
    this.entities[parseName(adminEntity.name)] = adminEntity
  }

  getEntitiesMetadata() {
    return Object.values(this.entities).map(e => e.metadata)
  }

  getRepository(entityName: string) {
    const adminEntity = this.entities[entityName]
    if (!adminEntity) throw new Error(`Admin for "${entityName}" has not been registered`)

    const repository = adminEntity.repository
    if (!repository) throw new Error(`Repository for "${entityName}" does not exist`)

    return repository
  }
}

export default AdminSection
