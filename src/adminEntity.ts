import { Connection, EntityMetadata, SelectQueryBuilder, Brackets } from './utils/typeormSwitch'
import { EntityType } from './types'
import { getDefaultWidget } from './widgets/utils'
import DefaultAdminSite from './adminSite'
import ManyToManyWidget from './widgets/manyToManyWidget'
import { InvalidDisplayFieldsException } from './exceptions/invalidDisplayFields.exception'

abstract class AdminEntity {
  /**
   * This is for internal use, it allows us to identify that a class extends AdminEntity.
   * `instanceof` should work, but it breaks in testing. This is a workaround that's not
   * elegant, but has little chance of breaking.
   */
  static adminEntityDiscriminant = 'ADMIN_ENTITY_DISCRIMINANT'
  abstract entity: EntityType

  /**
   * Fields of the entity that will be displayed on the list page
   */
  listDisplay: string[] | null = null

  /**
   * Fields of the entity that will be searchable on the list page
   */
  searchFields: string[] | null = null
  resultsPerPage: number = 25

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

  buildSearchQueryOptions(
    query: SelectQueryBuilder<unknown>, // @debt typing "miker: can I type this better?"
    options: { alias: string; searchParam: string },
  ) {
    if (options.searchParam && this.searchFields) {
      const searchArray = options.searchParam.split(' ')
      searchArray.forEach((searchTerm, searchTermIndex) =>
        query.andWhere(
          new Brackets((qb: SelectQueryBuilder<unknown>) => {
            this.searchFields.forEach((field, fieldIndex) => {
              const paramString = `searchTerm${searchTermIndex}Field${fieldIndex}`
              qb.orWhere(`${options.alias}.${field} LIKE :${paramString}`, {
                [paramString]: `%${searchTerm}%`,
              })
            })
            return qb
          }),
        ),
      )
    }
    return query
  }

  buildPaginationQueryOptions(
    query: SelectQueryBuilder<unknown>, // @debt typing "miker: can I type this better?",
    page: number,
  ) {
    query.skip(this.resultsPerPage * (page - 1)).take(this.resultsPerPage)
    return query
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
}

export default AdminEntity
