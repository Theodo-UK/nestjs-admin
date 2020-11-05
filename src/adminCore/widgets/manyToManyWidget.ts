import { Widget } from './widget.interface'
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata'
import { DefaultAdminSite } from '../../index'

export default class ManyToManyWidget implements Widget {
  template = 'widgets/manytomany.njk'

  constructor(
    public readonly relation: RelationMetadata,
    public readonly adminSite: DefaultAdminSite,
    public readonly entity?: object,
  ) {}

  getLabel() {
    return this.relation.propertyName
  }

  isRequired() {
    return !this.relation.isNullable
  }

  getValue() {
    if (!this.entity) {
      return null
    }
    return this.relation.getEntityValue(this.entity)
  }
}
