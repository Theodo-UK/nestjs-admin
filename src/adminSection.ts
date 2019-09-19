import { parseName } from './utils/formatting'
import AdminEntity from './adminEntity'

class AdminSection {
  entities: { [key: string]: AdminEntity } = {}
  constructor(public readonly name: string) {}

  register(adminEntity: AdminEntity) {
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
