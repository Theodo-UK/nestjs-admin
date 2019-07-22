import { Environment } from 'nunjucks'
import { parseName } from './utils/formatting'
import { EntityMetadata } from 'typeorm';
import { AdminSection } from './admin.service';

type Route = 'changelist' | 'change'

type RouteArgs = string[]

function changeListUrl(section: AdminSection, metadata: EntityMetadata) {
  return `/admin/${parseName(section.name)}/${parseName(metadata.name)}`
}
function changeUrl(section: AdminSection, metadata: EntityMetadata, entity: object) {
  if (metadata.primaryColumns.length !== 1) {
    // @debt TODO "williamd: probably still covers most cases, but still TODO"
    throw 'Entities with multiple primary columns unsupported. If you have this use case, please open a GitHub issue'
  }
  const primaryKey = metadata.primaryColumns[0].getEntityValue(entity)
  return `/admin/${parseName(section.name)}/${parseName(metadata.name)}/${primaryKey}`
}

function adminUrl(route: Route, ...args: RouteArgs) {
  switch (route) {
    case 'changelist':
      return changeListUrl(...(args as [any, any]))
    case 'change':
      return changeUrl(...(args as [any, any, any]))
    default:
      const guard: never = route
      throw `Route "${route}" doesn't exist`
  }
}

function displayName(entity: object, metadata: EntityMetadata) {
  // @ts-ignore
  if (entity.__proto__.hasOwnProperty('toString')) {
    return entity.toString()
  }
  const primaryColumns = metadata.primaryColumns.map(col => col.getEntityValue(entity))
  return primaryColumns.join(' - ')
}

export function addFilters(env: Environment) {
  env.addFilter('adminUrl', adminUrl);
  env.addFilter('displayName', displayName);
}
