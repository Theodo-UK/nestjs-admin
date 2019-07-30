import { Get, Post, Controller, Render, Param, Query, Body } from '@nestjs/common'
import { Repository, EntityMetadata } from 'typeorm'
import { AdminSite, AdminSection } from './admin.service'
import { getWidgetTemplate } from './utils/formatting'

function getPaginationOptions(page?: number) {
  page = page || 0
  // @debt architecture "williamd: this could be made configurable on a per-section basis"
  const perPage = 25

  return {
    skip: perPage * page,
    take: perPage,
  }
}

type AdminModelsQuery = {
  sectionName?: string
  entityName?: string
  primaryKey?: string
}

type AdminModelsResult = {
  section: AdminSection
  repository: Repository<unknown>
  metadata: EntityMetadata
  entity: object
}

@Controller('admin')
export class AdminController {
  constructor(private adminSite: AdminSite) {}

  async getAdminModels(query: AdminModelsQuery): Promise<AdminModelsResult> {
    // @ts-ignore
    const result: AdminModelsResult = {}
    if (query.sectionName) {
      result.section = this.adminSite.getSection(query.sectionName)
      if (query.entityName) {
        result.repository = result.section.getRepository(query.entityName)
        result.metadata = result.repository.metadata
        if (query.primaryKey) {
          result.entity = (await result.repository.findOneOrFail(query.primaryKey, {})) as object
        }
      }
    }
    return result
  }

  @Get()
  @Render('index.njk')
  index() {
    const sections = this.adminSite.getSectionList()
    return { sections }
  }

  @Get(':sectionName/:entityName')
  @Render('changelist.njk')
  async changeList(@Param() params: AdminModelsQuery, @Query('page') page?: number) {
    const { section, repository, metadata } = await this.getAdminModels(params)
    const [entities, count] = await repository.findAndCount(getPaginationOptions(page))
    return { section, entities, count, metadata }
  }

  @Get(':sectionName/:entityName/:primaryKey')
  @Render('change.njk')
  async change(@Param() params: AdminModelsQuery) {
    const { section, metadata, entity } = await this.getAdminModels(params)
    return { section, metadata, entity, getWidgetTemplate }
  }

  @Post(':sectionName/:entityName/:primaryKey')
  @Render('change.njk')
  async update(@Body() updateEntityDto: object, @Param() params: AdminModelsQuery) {
    const { section, repository, metadata, entity } = await this.getAdminModels(params)

    const updateCriteria = metadata.getEntityIdMap(entity)
    await repository.update(updateCriteria, updateEntityDto)

    const updatedEntity = await repository.findOneOrFail(params.primaryKey)
    return { section, metadata, entity: updatedEntity, getWidgetTemplate }
  }
}
