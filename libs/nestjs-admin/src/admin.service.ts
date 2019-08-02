import { Injectable } from '@nestjs/common'
import { Connection } from 'typeorm'
import { parseName } from './utils/formatting'

type EntityType = new () => unknown

export class AdminEntity {
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

export class AdminSection {
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

@Injectable()
export class AdminSite {
  constructor(private readonly connection: Connection) {}

  sections: { [sectionName: string]: AdminSection } = {}

  private getOrCreateSection(sectionName: string) {
    if (!this.sections[sectionName]) {
      this.sections[sectionName] = new AdminSection(sectionName, this.connection)
    }
    return this.sections[sectionName]
  }

  register(sectionName: string, entity: EntityType): void
  register(unsafeName: string, entity: EntityType) {
    const name = parseName(unsafeName)
    const section = this.getOrCreateSection(name)
    section.register(entity)
  }

  getSectionList() {
    /**
     * @debt quality "Rely on implementation detail"
     * We use the key to sort here, relying on the fact that
     * it is the name, which is more of an implementation detail
     */
    const keys = Object.keys(this.sections)
    return keys.sort((k1, k2) => k1.localeCompare(k2)).map(key => this.sections[key])
  }

  getSection(sectionName: string): AdminSection
  getSection(unsafeName: string) {
    const name = parseName(unsafeName)
    const section = this.sections[name]
    if (!section) {
      throw new Error(
        `Section "${unsafeName}" does not exist. Have you registered an entity under this section?`,
      )
    }
    return section
  }

  getRepository(entityName: EntityType) {
    return this.connection.getRepository(entityName)
  }
}
