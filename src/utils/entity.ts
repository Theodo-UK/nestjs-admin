import { EntityMetadata } from './typeormProxy'
import { EntityType } from '../types'

export function getPrimaryKeyValue(metadata: EntityMetadata, entity: object) {
  return metadata.getEntityIdMixedMap(entity)
}

export function isEntityInList(entity: EntityType, array: EntityType[], metadata: EntityMetadata) {
  if (!array || !entity) return false

  const idCols = metadata.primaryColumns.map((col) => col.propertyName)
  return (
    array.findIndex((item) =>
      // @ts-ignore
      idCols.every((idCol) => item[idCol] === entity[idCol]),
    ) !== -1
  )
}
