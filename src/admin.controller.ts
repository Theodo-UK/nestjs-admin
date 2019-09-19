import {
  Inject,
  Get,
  Post,
  Controller,
  Param,
  Query,
  Body,
  Response,
  UseGuards,
  UseFilters,
  Req,
} from '@nestjs/common'
import { Repository, EntityMetadata } from 'typeorm'
import * as express from 'express'
import DefaultAdminSite from './adminSite'
import DefaultAdminSection from './adminSection'
import DefaultAdminNunjucksEnvironment from './admin.environment'
import * as urls from './utils/urls'
import AdminEntity from './adminEntity'
import { isClass } from './utils/typechecks'
import { AdminGuard } from './admin.guard'
import { AdminFilter } from './admin.filter'
import { injectionTokens } from './tokens'
import { Request } from 'express'
import { getPrimaryKeyValue } from './utils/entity'
import { displayName } from './admin.filters'

const resultsPerPage = 25

function getPaginationQueryOptions(page: number) {
  // @debt architecture "williamd: this could be made configurable on a per-section basis"
  return {
    skip: resultsPerPage * (page - 1),
    take: resultsPerPage,
  }
}

type AdminModelsQuery = {
  sectionName?: string
  entityName?: string
  primaryKey?: string
}

type AdminModelsResult = {
  section: DefaultAdminSection
  adminEntity: AdminEntity
  repository: Repository<unknown>
  metadata: EntityMetadata
  entity: object
}

@Controller('admin')
@UseGuards(AdminGuard)
@UseFilters(AdminFilter)
export class DefaultAdminController {
  constructor(
    @Inject(injectionTokens.ADMIN_SITE)
    private adminSite: DefaultAdminSite,
    @Inject(injectionTokens.ADMIN_ENVIRONMENT)
    private env: DefaultAdminNunjucksEnvironment,
  ) {}

  async getEntityWithRelations(repository: Repository<unknown>, primaryKey: any) {
    const metadata = repository.metadata
    const relations = metadata.relations.map(r => r.propertyName)
    return (await repository.findOneOrFail(primaryKey, {
      relations,
    })) as object
  }

  async getAdminModels(query: AdminModelsQuery): Promise<AdminModelsResult> {
    // @ts-ignore
    const result: Partial<AdminModelsResult> = {}
    if (query.sectionName) {
      result.section = this.adminSite.getSection(query.sectionName)
      if (query.entityName) {
        result.adminEntity = result.section.getAdminEntity(query.entityName)
        result.repository = result.adminEntity.repository
        result.metadata = result.adminEntity.metadata
        if (query.primaryKey) {
          const decodedPrimaryKey = JSON.parse(decodeURIComponent(query.primaryKey))
          result.entity = await this.getEntityWithRelations(result.repository, decodedPrimaryKey)
        }
      }
    }
    return result as AdminModelsResult
  }

  @Get()
  async index(@Req() request: Request) {
    const sections = this.adminSite.getSectionList()
    return await this.env.render('index.njk', { sections, request })
  }

  @Get(':sectionName/:entityName')
  async changeList(
    @Req() request: Request,
    @Param() params: AdminModelsQuery,
    @Query('page') pageParam: string = '1',
  ) {
    const {
      section,
      repository,
      metadata,
      adminEntity: { listDisplay },
    } = await this.getAdminModels(params)
    const page = parseInt(pageParam, 10)
    const [entities, count] = await repository.findAndCount(getPaginationQueryOptions(page))

    return await this.env.render('changelist.njk', {
      request,
      section,
      entities,
      count,
      metadata,
      page,
      resultsPerPage,
      listDisplay,
    })
  }

  @Get(':sectionName/:entityName/add')
  async add(@Req() request: Request, @Param() params: AdminModelsQuery) {
    const { section, metadata, adminEntity } = await this.getAdminModels(params)
    return await this.env.render('add.njk', { request, section, metadata, adminEntity })
  }

  @Post(':sectionName/:entityName/add')
  async create(
    @Req() request: Request,
    @Body() createEntityDto: object,
    @Param() params: AdminModelsQuery,
    @Response() response: express.Response,
  ) {
    const { section, repository, metadata } = await this.getAdminModels(params)

    // @debt architecture "This should be entirely moved to the adminSite, so that it can be overriden by the custom adminSite of a user"
    let entityToBePersisted = await this.adminSite.cleanValues(createEntityDto, metadata)

    // metadata.target is the entity class
    // entity class needs to be saved so that listeners and subscribers are triggered
    if (isClass(metadata.target)) {
      entityToBePersisted = Object.assign(new metadata.target(), entityToBePersisted)
    }

    const createdEntity = await repository.save(entityToBePersisted)

    request.flash(
      'messages',
      `Successfully created ${metadata.name}: ${displayName(createdEntity, metadata)}`,
    )
    return response.redirect(urls.changeUrl(section, metadata, createdEntity))
  }

  @Get(':sectionName/:entityName/:primaryKey/change')
  async change(@Req() request: Request, @Param() params: AdminModelsQuery) {
    const { section, adminEntity, metadata, entity } = await this.getAdminModels(params)
    return await this.env.render('change.njk', { request, section, adminEntity, metadata, entity })
  }

  @Post(':sectionName/:entityName/:primaryKey/change')
  async update(
    @Req() request: Request,
    @Body() updateEntityDto: object,
    @Param() params: AdminModelsQuery,
    @Response() response: express.Response,
  ) {
    const { section, repository, metadata, entity } = await this.getAdminModels(params)

    // @debt architecture "This should be entirely moved to the adminSite, so that it can be overriden by the custom adminSite of a user"
    const updatedValues = await this.adminSite.cleanValues(updateEntityDto, metadata)

    // entity class needs to be saved so that listeners and subscribers are triggered
    // @ts-ignore
    const entityToBePersisted = Object.assign(new metadata.target(), entity, updatedValues)

    // We first have to update the primary key, because `save()` would create a new entity.
    // We don't update all fields with `update()`, because it doesn't cascade or handle relations.
    await repository.update(
      metadata.getEntityIdMap(entity),
      metadata.getEntityIdMap(entityToBePersisted),
    )
    // Primary key updated, we can safely update all the other fields
    await repository.save(entityToBePersisted)

    const updatedEntity = await this.getEntityWithRelations(
      repository,
      getPrimaryKeyValue(metadata, entityToBePersisted),
    )
    request.flash(
      'messages',
      `Successfully updated ${metadata.name}: ${displayName(entity, metadata)}`,
    )
    return response.redirect(urls.changeUrl(section, metadata, updatedEntity))
  }

  @Post(':sectionName/:entityName/:primaryKey/delete')
  async delete(
    @Req() request: Request,
    @Param() params: AdminModelsQuery,
    @Response() response: express.Response,
  ) {
    const { section, repository, metadata, entity } = await this.getAdminModels(params)
    const entityDisplayName = displayName(entity, metadata)
    // @debt architecture "This should be entirely moved to the adminSite, so that it can be overriden by the custom adminSite of a user"
    await repository.remove(entity)
    request.flash('messages', `Successfully deleted ${metadata.name}: ${entityDisplayName}`)
    return response.redirect(urls.changeListUrl(section, metadata))
  }
}
