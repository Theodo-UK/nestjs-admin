import { Injectable } from '@nestjs/common';
import { Connection, EntitySchema, Repository } from 'typeorm';
import { parseName } from './utils/formatting'

type EntityType = Function | EntitySchema<any> | string

export class AdminSection {
  repositories: { [key: string]: Repository<unknown> } = {}
  constructor(public readonly name: string) { }

  register(repository: Repository<unknown>) {
    const name = repository.metadata.name
    this.repositories[name.toLowerCase()] = repository
  }

  getEntitiesMetadata() {
    return Object.values(this.repositories).map(r => r.metadata)
  }

  getRepository(entityName: string) {
    const repository = this.repositories[entityName]
    if (!repository) {
      throw `Repository for "${entityName}" does not exist`
    }
    return repository
  }
}

@Injectable()
export class AdminSite {
  constructor(private readonly connection: Connection) { }

  sections: { [sectionName: string]: AdminSection } = {}

  private getOrCreateSection(sectionName: string) {
    if (!this.sections[sectionName]) {
      this.sections[sectionName] = new AdminSection(sectionName)
    }
    return this.sections[sectionName]
  }

  register(sectionName: string, entity: EntityType): void;
  register(unsafeName: string, entity: EntityType) {
    const name = parseName(unsafeName)
    const section = this.getOrCreateSection(name)
    const repository = this.connection.getRepository(entity)
    section.register(repository)
  }

  getSectionList() {
    /**
     * @debt quality "Rely on implementation detail"
     * We use the key to sort here, relying on the fact that
     * it is the name, which is more of an implementation detail
     */
    const keys = Object.keys(this.sections)
    return keys
      .sort((k1, k2) => k1.localeCompare(k2))
      .map(key => this.sections[key])
  }

  getSection(sectionName: string): AdminSection;
  getSection(unsafeName: string) {
    const name = parseName(unsafeName)
    const section = this.sections[name]
    if (!section) {
      throw `Section "${unsafeName}" does not exist. Have you registered an entity under this section?`
    }
    return section
  }
}
