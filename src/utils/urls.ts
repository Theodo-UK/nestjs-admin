import { EntityMetadata } from 'typeorm'
import AdminSection from '../adminSection'
import { parseName } from './formatting'
import { getPrimaryKeyValue } from './entity'

export function indexUrl() {
  return `/admin`
}

export function loginUrl() {
  return `/admin/login`
}

export function logoutUrl() {
  return `/admin/logout`
}

export function changeListUrl(section: AdminSection, metadata: EntityMetadata) {
  return `/admin/${parseName(section.name)}/${parseName(metadata.name)}`
}

export function changeUrl(section: AdminSection, metadata: EntityMetadata, entity: object) {
  const primaryKey = getPrimaryKeyValue(metadata, entity)
  return `/admin/${parseName(section.name)}/${parseName(metadata.name)}/${primaryKey}/change`
}

export function deleteUrl(section: AdminSection, metadata: EntityMetadata, entity: object) {
  const primaryKey = getPrimaryKeyValue(metadata, entity)
  return `/admin/${parseName(section.name)}/${parseName(metadata.name)}/${primaryKey}/delete`
}

export function addUrl(section: AdminSection, metadata: EntityMetadata) {
  return `/admin/${parseName(section.name)}/${parseName(metadata.name)}/add`
}
