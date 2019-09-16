import { Connection } from 'typeorm'
import { EntityType } from './types'
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata'
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata'
import { getDefaultWidget } from './widgets/utils'
import DefaultAdminSite from './adminSite'

class AdminEntity {
  constructor(
    public readonly entity: EntityType,
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

  getWidgets(form: 'add' | 'change') {
    const fields = this.getFields(form)
    const widgets = fields
      .filter(field => this.metadata.columns.map(column => column.propertyName).includes(field))
      .map(field => {
        const column = this.getColumnOrRelation(field) as ColumnMetadata
        return getDefaultWidget(column, this.adminSite)
      })
    const manyToManyWidgets = fields
      .filter(field => !this.metadata.columns.map(column => column.propertyName).includes(field))
      .map(
        field =>
          new (class {
            template = 'widgets/manytomany.njk'
          })(),
      )

    return [...widgets, ...manyToManyWidgets]
  }

  getColumnOrRelation(propertyName: string): ColumnMetadata | RelationMetadata {
    const column = this.metadata.findColumnWithPropertyName(propertyName)
    if (!column) {
      return this.metadata.findRelationWithPropertyPath(propertyName)
    }
    return column
  }
}

export default AdminEntity
