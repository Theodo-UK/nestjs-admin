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
import AdminEntity from './adminEntity'
import { InvalidAdminRegistration } from './exceptions/invalidAdminRegistration.exception'

@Injectable()
class DefaultAdminSite {
  /**
   * The title to put at the top of each admin page.
   * By default, this is 'NestJS Administration'.
   */
  siteHeader = 'NestJS Administration'

  /* @debt architecture "We should use the EntityManager instead of the Connection and Repositories" */
  constructor(private readonly connection: Connection) {}

  sections: { [sectionName: string]: AdminSection } = {}

  private getOrCreateSection(sectionName: string) {
    if (!this.sections[sectionName]) {
      this.sections[sectionName] = new AdminSection(sectionName, this, this.connection)
    }
    return this.sections[sectionName]
  }

  register(sectionName: string, adminEntity: EntityType | typeof AdminEntity): void
  register(unsafeName: string, adminEntityOrEntity: EntityType | typeof AdminEntity) {
    /**
     * Register either an entity, or an extension of AdminEntity, in a section.
     */
    const name = parseName(unsafeName)
    const section = this.getOrCreateSection(name)

    if (adminEntityOrEntity.prototype instanceof AdminEntity) {
      const AdminEntityClass = adminEntityOrEntity as typeof AdminEntity
      // @ts-ignore
      const adminEntity = new AdminEntityClass(this.connection)
      section.register(adminEntity)
    } else if (this.connection.hasMetadata(adminEntityOrEntity)) {
      // if adminEntityOrEntity is an entity:
      const entity = adminEntityOrEntity as EntityType
      class AdminEntityClass extends AdminEntity {
        entity = entity
      }
      const adminEntity = new AdminEntityClass(this.connection)
      section.register(adminEntity)
    } else {
      throw new InvalidAdminRegistration(adminEntityOrEntity)
    }
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

  getRepository(entity: EntityType) {
    return this.connection.getRepository(entity)
  }

  getEntityMetadata(entity: EntityType) {
    return this.connection.getMetadata(entity)
  }

  async cleanValues(values: { [k: string]: any }, metadata: EntityMetadata) {
    // @debt architecture "williamd: this should be broken down in `clean` methods of separate widget classes"
    const propertyNames = Object.keys(values)
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
        if (isEnumType(column.type) && value === '') {
          cleanedValues[property] = null
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
            // Due to checkboxes not sending any value on submit, we need a to send a default value.
            // If the checkbox is unchecked we'll only have the default, if it is checked we'll have
            // an array with the default and the 'checked' value
            const singleValue = Array.isArray(value) ? value[value.length - 1] : value
            cleanedValues[property] = singleValue === '1'
          }
        }
      }

      if (cleanedValues[property] === undefined) {
        cleanedValues[property] = value
      }
    }
    return cleanedValues
  }
}

export default DefaultAdminSite
