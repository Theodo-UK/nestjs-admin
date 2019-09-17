import { EntityMetadata } from 'typeorm'
import { EntityType } from '../types'

export function getPrimaryKeyValue(metadata: EntityMetadata, entity: object) {
  if (metadata.primaryColumns.length !== 1) {
    // @debt TODO "williamd: probably still covers most cases, but still TODO"
    throw new Error(
      `Entities with composite primary keys unsupported (${
        metadata.name
      }). If you have this use case, please open a GitHub issue`,
    )
  }
  return metadata.primaryColumns[0].getEntityValue(entity)
}
export function isEntityInList(entity: EntityType, array: EntityType[], metadata: EntityMetadata) {
  if (!array || !entity) return false

  const idCols = metadata.primaryColumns.map(col => col.propertyName)
  return (
    array.findIndex(item =>
      // @ts-ignore
      idCols.every(idCol => item[idCol] === entity[idCol]),
    ) !== -1
  )
}
