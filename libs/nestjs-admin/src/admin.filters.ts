import { parseName } from './utils/formatting'
import { EntityMetadata } from 'typeorm'
import AdminSection from './adminSection'

type Route = 'changelist' | 'change' | 'add'

type RouteArgs = string[]

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

function changeListUrl(section: AdminSection, metadata: EntityMetadata) {
  return `/admin/${parseName(section.name)}/${parseName(metadata.name)}`
}

function changeUrl(section: AdminSection, metadata: EntityMetadata, entity: object) {
  const primaryKey = getPrimaryKeyValue(metadata, entity)
  return `/admin/${parseName(section.name)}/${parseName(metadata.name)}/${primaryKey}/change`
}

function addUrl(section: AdminSection, metadata: EntityMetadata) {
  return `/admin/${parseName(section.name)}/${parseName(metadata.name)}/add`
}

export function adminUrl(route: Route, ...args: RouteArgs) {
  switch (route) {
    case 'changelist':
      return changeListUrl(...(args as [any, any]))
    case 'change':
      return changeUrl(...(args as [any, any, any]))
    case 'add':
      return addUrl(...(args as [any, any]))
    default:
      const guard: never = route
      throw new Error(`Route "${route}" doesn't exist`)
  }
}

export function displayName(entity: object, metadata: EntityMetadata) {
  // @ts-ignore
  if (entity.__proto__.hasOwnProperty('toString')) {
    return entity.toString()
  }
  const primaryColumns = metadata.primaryColumns.map(col => col.getEntityValue(entity))
  return primaryColumns.join(' - ')
}
