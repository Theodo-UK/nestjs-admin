import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata'
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata'
import { AdminSite } from '../admin.service'
import { isFunction } from './typechecks'

export function getWidgetTemplate(column: ColumnMetadata) {
  if (!!column.relationMetadata) {
    // the column is a foreign key
    return 'widget-foreign-key.njk'
  }

  switch (column.type) {
    case 'text':
      return 'widget-textarea.njk'
    case 'simple-array':
      return 'widget-simple-array.njk'
    default:
      return 'widget-text.njk'
  }
}

export async function getRelationOptions(
  adminSite: AdminSite,
  relation: RelationMetadata,
  cb: any,
) {
  const type = isFunction(relation.type) ? relation.type() : relation.type
  const repository = adminSite.getRepository(type)
  const options = await repository.find()
  cb(null, options)
}
