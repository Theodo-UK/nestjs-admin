import { Connection } from 'typeorm'
import { parseName } from './utils/formatting'
import { EntityType } from './types'
import AdminEntity from './adminEntity'
import DefaultAdminSite from './adminSite'

class AdminSection {
  entities: { [key: string]: AdminEntity } = {}
  constructor(
    public readonly name: string,
    private readonly adminSite: DefaultAdminSite,
    private readonly connection: Connection,
  ) {}

  register(entity: EntityType) {
    const adminEntity = new AdminEntity(entity, this.adminSite, this.connection)
    this.entities[parseName(adminEntity.name)] = adminEntity
  }

  getAdminEntity(entityName: string) {
    const adminEntity = this.entities[entityName]
    if (!adminEntity) throw new Error(`Admin for "${entityName}" has not been registered`)
    return adminEntity
  }

  getEntitiesMetadata() {
    return Object.values(this.entities).map(e => e.metadata)
  }

  getRepository(entityName: string) {
    const adminEntity = this.getAdminEntity(entityName)
    const repository = adminEntity.repository
    if (!repository) throw new Error(`Repository for "${entityName}" does not exist`)

    return repository
  }
}

export default AdminSection
