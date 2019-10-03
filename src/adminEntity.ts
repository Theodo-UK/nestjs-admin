import { Connection, EntityMetadata } from 'typeorm'
import { EntityType } from './types'
import { getDefaultWidget } from './widgets/utils'
import DefaultAdminSite from './adminSite'
import ManyToManyWidget from './widgets/manyToManyWidget'
import { InvalidSearchFieldsException } from './exceptions/invalidSearchFields.exception'
import { InvalidDisplayFieldsException } from './exceptions/invalidDisplayFields.exception'
import InvalidDisplayFieldsException from './exceptions/invalidDisplayFields.exception'
import { WidgetConstructor } from './widgets/widget.interface'

abstract class AdminEntity {
  abstract entity: EntityType

  /**
   * Fields of the entity that will be displayed on the list page
   */
  listDisplay: string[] | null = null

  /**
   * Fields of the entity that will be searchable on the list page
   */
  searchFields: string[] | null = null
  widgets: { [propertyName: string]: WidgetConstructor } = {}

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
        if (this.widgets[field]) {
          return new this.widgets[field](column, this.adminSite, entity)
        } else {
          return getDefaultWidget(column, this.adminSite, entity)
        }
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
    this.validateSearchFields()
  }

  private validateDisplayFields() {
    validateFieldsExist(this, 'listDisplay', this.metadata)
    validateFieldsAreNotRelation(this, 'listDisplay', this.metadata)
  }

  private validateSearchFields() {
    validateFieldsExist(this, 'searchFields', this.metadata)
    validateFieldsAreNotRelation(this, 'searchFields', this.metadata)
  }
}

function validateFieldsExist(
  adminEntity: AdminEntity,
  configField: keyof AdminEntity,
  metadata: EntityMetadata,
) {
  const fieldsList = adminEntity[configField] as string[]
  if (!fieldsList) return

  fieldsList.forEach(field => {
    if (!metadata.columns.map(column => column.propertyName).includes(field)) {
      throw new InvalidDisplayFieldsException(
        `Property ${field} invalid in ${configField}: does not exist on ${metadata.name}.`,
      )
    }
  })
}

function validateFieldsAreNotRelation(
  adminEntity: AdminEntity,
  configField: keyof AdminEntity,
  metadata: EntityMetadata,
) {
  const fieldsList = adminEntity[configField] as string[]
  if (!fieldsList) return

  fieldsList.forEach(field => {
    const relation = metadata.findRelationWithPropertyPath(field)
    if (relation) {
      throw new InvalidDisplayFieldsException(
        `Property ${field} on ${metadata.name} invalid in ${configField}: relations are not supported for displaying.`,
      )
    }
  })
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
