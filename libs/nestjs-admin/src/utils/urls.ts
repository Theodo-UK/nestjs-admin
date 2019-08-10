import { EntityMetadata } from 'typeorm'
import AdminSection from '../adminSection'
import { parseName } from './formatting'

function getPrimaryKeyValue(metadata: EntityMetadata, entity: object) {
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

export function indexUrl() {
  return `/admin`
}

export function changeListUrl(section: AdminSection, metadata: EntityMetadata) {
  return `/admin/${parseName(section.name)}/${parseName(metadata.name)}`
}

export function changeUrl(section: AdminSection, metadata: EntityMetadata, entity: object) {
  const primaryKey = getPrimaryKeyValue(metadata, entity)
  return `/admin/${parseName(section.name)}/${parseName(metadata.name)}/${primaryKey}/change`
}

export function addUrl(section: AdminSection, metadata: EntityMetadata) {
  return `/admin/${parseName(section.name)}/${parseName(metadata.name)}/add`
}
