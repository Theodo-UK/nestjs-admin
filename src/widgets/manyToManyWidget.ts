import { Widget } from './widget.interface'
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata'
import { DefaultAdminSite } from 'src'

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

  getValue() {
    if (!this.entity) {
      return null
    }
    return this.relation.getEntityValue(this.entity)
  }
}
