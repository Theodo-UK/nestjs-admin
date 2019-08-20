import { Injectable } from '@nestjs/common'
import { Connection, EntityMetadata } from 'typeorm'
import { parseName } from './utils/formatting'
import AdminSection from './adminSection'
import { EntityType } from './types'
import {
  isIntegerType,
  isNumberType,
  isDateType,
  isBooleanType,
  isEnumType,
  isDecimalType,
} from './utils/column'

@Injectable()
class DefaultAdminSite {
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

  async cleanValues(values: { [k: string]: any }, metadata: EntityMetadata) {
    // @debt architecture "williamd: this should probably be moved to a Form class"
    // Also, this whole function is a mess of state and special cases. We need to find
    // a better way to organise this.
    const propertyNames = metadata.columns.map(column => column.propertyName)
    const cleanedValues: typeof values = {}

    for (const property of propertyNames) {
      const value = values[property]
      const column = metadata.findColumnWithPropertyName(property)

      if (!column) {
        // Manytomany
        const relation = metadata.findRelationWithPropertyPath(property)
        const repo = this.connection.getRepository(relation.type)
        cleanedValues[property] = await repo.findByIds(value)
        continue
      }

      if (!value) {
        if (
          !!column.relationMetadata ||
          (isNumberType(column.type) && value !== 0) ||
          isDateType(column.type) ||
          isEnumType(column.type) ||
          isDateType(column.type)
        ) {
          cleanedValues[property] = null
        }
        if (isBooleanType(column.type) && value !== false) {
          cleanedValues[property] = column.isNullable ? null : false
        }
      } else {
        if (isIntegerType(column.type)) {
          cleanedValues[property] = parseInt(value, 10)
        }
        if (isDecimalType(column.type)) {
          cleanedValues[property] = parseFloat(value)
        }
        if (isBooleanType(column.type)) {
          if (column.isNullable) {
            switch (value) {
              case 'true':
                cleanedValues[property] = true
                break
              case 'false':
                cleanedValues[property] = false
                break
              case 'null':
                cleanedValues[property] = null
                break
            }
          } else {
            cleanedValues[property] = true
          }
        }
      }

      if (cleanedValues[property] === undefined) {
        cleanedValues[property] = value
      }

      if (column.isGenerated) {
        cleanedValues[property] = undefined
      }
    }
    return cleanedValues
  }
}

export default DefaultAdminSite
