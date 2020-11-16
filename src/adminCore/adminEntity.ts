import { EntityMetadata, SelectQueryBuilder, Brackets } from '../utils/typeormProxy'
import { EntityType, MaybePromise } from '../types'
import { getDefaultWidget } from './widgets/utils'
import DefaultAdminSite from './adminSite'
import ManyToManyWidget from './widgets/manyToManyWidget'
import { InvalidDisplayFieldsException } from './exceptions/invalidDisplayFields.exception'
import { WidgetConstructor } from './widgets/widget.interface'

import { Request, Response } from 'express'

export type ListActionHandler = (request: Request, response: Response) => MaybePromise<void>
export type ListAction = { label: string; action: ListActionHandler }
export type ChangeActionHandler = (
  entity: object,
  request: Request,
  response: Response,
) => MaybePromise<void>
export type ChangeAction = { label: string; action: ChangeActionHandler }

abstract class AdminEntity {
  abstract entity: EntityType

  /**
   * Fields of the entity that will be displayed on the list page
   */
  listDisplay: string[] | null = null

  /**
   * List of the actions possible on the list page
   */
  listActions: ListAction[]

  /**
   * List of the actions possible on the change page
   */
  changeActions: ChangeAction[]

  /**
   * Fields of the entity that will be searchable on the list page
   */
  searchFields: string[] | null = null
  resultsPerPage: number = 25
  widgets: { [propertyName: string]: WidgetConstructor } = {}

  constructor(private readonly adminSite: DefaultAdminSite) {}

  get repository() {
    return this.adminSite.connection.getRepository(this.entity)
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
      ...this.metadata.columns.map((column) => column.propertyName),
      ...this.metadata.manyToManyRelations.map((relation) => relation.propertyName),
    ]
  }

  getWidgets(form: 'add' | 'change', entity?: object) {
    const fields = this.getFields(form)

    const widgets = fields
      .filter((field) => this.metadata.columns.map((column) => column.propertyName).includes(field))
      .filter((field) => {
        const column = this.metadata.findColumnWithPropertyName(field)
        return !(form === 'add' && column.isGenerated)
      })
      .map((field) => {
        const column = this.metadata.findColumnWithPropertyName(field)
        if (this.widgets[field]) {
          return new this.widgets[field](column, this.adminSite, entity)
        } else {
          return getDefaultWidget(column, this.adminSite, entity)
        }
      })

    const manyToManyWidgets = fields
      .filter(
        (field) => !this.metadata.columns.map((column) => column.propertyName).includes(field),
      )
      .map((field) => {
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

  protected buildSearchQueryOptions(
    query: SelectQueryBuilder<unknown>,
    alias: string,
    searchParam: string,
  ) {
    if (searchParam && this.searchFields) {
      const searchArray = searchParam.split(' ')
      searchArray.forEach((searchTerm, searchTermIndex) =>
        query.andWhere(
          new Brackets((qb: SelectQueryBuilder<unknown>) => {
            this.searchFields.forEach((field, fieldIndex) => {
              const paramString = `searchTerm${searchTermIndex}Field${fieldIndex}`
              qb.orWhere(`${alias}.${field} LIKE :${paramString}`, {
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

  protected buildPaginationQueryOptions(query: SelectQueryBuilder<unknown>, page: number) {
    query.skip(this.resultsPerPage * (page - 1)).take(this.resultsPerPage)
    return query
  }

  async getEntityList(
    page: number,
    searchString: string,
  ): Promise<{ entities: unknown[]; count: number }> {
    const alias = this.name
    let query = this.adminSite.entityManager.createQueryBuilder(this.entity, alias)
    query = this.buildPaginationQueryOptions(query, page)
    query = this.buildSearchQueryOptions(query, alias, searchString)
    const [entities, count] = await query.getManyAndCount()
    return { entities, count }
  }
}

function validateFieldsExist(
  adminEntity: AdminEntity,
  configField: keyof AdminEntity,
  metadata: EntityMetadata,
) {
  const fieldsList = adminEntity[configField] as string[]
  if (!fieldsList) return

  fieldsList.forEach((field) => {
    if (!metadata.columns.map((column) => column.propertyName).includes(field)) {
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

  fieldsList.forEach((field) => {
    const relation = metadata.findRelationWithPropertyPath(field)
    if (relation) {
      throw new InvalidDisplayFieldsException(
        `Property ${field} on ${metadata.name} invalid in ${configField}: relations are not supported for displaying.`,
      )
    }
  })
  if (!adminEntity.listDisplay) return
  adminEntity.listDisplay.forEach((field) => {
    if (!metadata.columns.map((column) => column.propertyName).includes(field)) {
      throw new InvalidDisplayFieldsException(
        `Property ${field} invalid in listDisplay: does not exist on ${metadata.name}.`,
      )
    }
    // We do not support displaying relations.
    const relation = metadata.findRelationWithPropertyPath(field)
    if (relation) {
      throw new InvalidDisplayFieldsException(
        `Property ${field} on ${metadata.name} invalid in listDisplay: relations are not supported for displaying.`,
      )
    }
  })
}

export default AdminEntity
