import { Connection } from 'typeorm'
import { EntityType } from './types'
import { getDefaultWidget } from './widgets/utils'
import DefaultAdminSite from './adminSite'
import ManyToManyWidget from './widgets/manyToManyWidget'
import InvalidDisplayFieldsException from './exceptions/invalidDisplayFields.exception'

abstract class AdminEntity {
  /**
   * This is for internal use, it allows us to identify that a class extends AdminEntity.
   * `instanceof` should work, but it breaks in testing. This is a workaround that's not
   * elegant, but has little chance of breaking.
   */
  static adminEntityDiscriminant = 'ADMIN_ENTITY_DISCRIMINANT'
  abstract entity: EntityType
  listDisplay: string[] | null = null
  fields: string[] | null = null

  constructor(
    private readonly adminSite: DefaultAdminSite,
    private readonly connection: Connection,
  ) {}

  get repository() {
    return this.connection.getRepository(this.entity)
  }

  get metadata() {
    return this.repository.metadata
  }

  get name() {
    return this.metadata.name
  }

  /**
   * The fields displayed on the form
   */
  getFields(form: 'add' | 'change'): string[] {
    if (this.fields) {
      return this.fields
    }
    return [
      ...this.metadata.columns.map(column => column.propertyName),
      ...this.metadata.manyToManyRelations.map(relation => relation.propertyName),
    ]
  }

  getWidgets(form: 'add' | 'change', entity?: object) {
    const fields = this.getFields(form)

    const widgets = fields
      .filter(field => this.metadata.columns.map(column => column.propertyName).includes(field))
      .filter(field => {
        const column = this.metadata.findColumnWithPropertyName(field)
        return !(form === 'add' && column.isGenerated)
      })
      .map(field => {
        const column = this.metadata.findColumnWithPropertyName(field)
        return getDefaultWidget(column, this.adminSite, entity)
      })

    const manyToManyWidgets = fields
      .filter(field => !this.metadata.columns.map(column => column.propertyName).includes(field))
      .map(field => {
        const relation = this.metadata.findRelationWithPropertyPath(field)
        return new ManyToManyWidget(relation, this.adminSite, entity)
      })

    return [...widgets, ...manyToManyWidgets]
  }

  validateListConfig() {
    this.validateDisplayFields()
  }

  private validateDisplayFields() {
    if (!this.listDisplay) return
    this.listDisplay.forEach(field => {
      if (!this.metadata.columns.map(column => column.propertyName).includes(field)) {
        throw new InvalidDisplayFieldsException(
          `Property ${field} invalid in listDisplay: does not exist on ${this.name}.`,
        )
      }
      // We do not support displaying relations.
      const relation = this.metadata.findRelationWithPropertyPath(field)
      if (relation) {
        throw new InvalidDisplayFieldsException(
          `Property ${field} on ${this.name} invalid in listDisplay: relations are not supported for displaying.`,
        )
      }
    })
  }
}

export default AdminEntity
