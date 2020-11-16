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
import { EntityMetadata, EntityManager } from 'typeorm'
import * as express from 'express'
import DefaultAdminSite from './adminSite'
import DefaultAdminSection from './adminSection'
import DefaultAdminNunjucksEnvironment from './admin.environment'
import * as urls from '../utils/urls'
import AdminEntity from './adminEntity'
import { isClass } from '../utils/typechecks'
import { AdminGuard } from './admin.guard'
import { AdminFilter } from '../adminAuth/admin.filter'
import { injectionTokens } from '../tokens'
import { Request } from 'express'
import { getPrimaryKeyValue } from '../utils/entity'
import { displayName, prettyPrint } from './admin.filters'

type AdminModelsQuery = {
  sectionName?: string
  entityName?: string
  primaryKey?: string
}

type AdminModelsResult = {
  section: DefaultAdminSection
  adminEntity: AdminEntity
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
    private entityManager: EntityManager,
  ) {}

  async getEntityWithRelations(adminEntity: AdminEntity, primaryKey: any) {
    const metadata = adminEntity.metadata
    const relations = metadata.relations.map((r) => r.propertyName)
    return (await this.entityManager.findOneOrFail(adminEntity.entity, primaryKey, {
      relations,
    })) as object
  }

  async getAdminModels(query: AdminModelsQuery): Promise<AdminModelsResult> {
    // @ts-ignore
    const result: AdminModelsResult = {}
    if (query.sectionName) {
      result.section = this.adminSite.getSection(query.sectionName)
      if (query.entityName) {
        result.adminEntity = result.section.getAdminEntity(query.entityName)
        result.metadata = result.adminEntity.metadata
        if (query.primaryKey) {
          const decodedPrimaryKey = JSON.parse(decodeURIComponent(query.primaryKey))
          result.entity = await this.getEntityWithRelations(result.adminEntity, decodedPrimaryKey)
        }
      }
    }
    return result
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
    @Query('search') searchString: string,
  ) {
    const { section, metadata, adminEntity } = await this.getAdminModels(params)
    const page = parseInt(pageParam, 10)
    const { entities, count } = await this.adminSite.getEntityList(adminEntity, page, searchString)

    adminEntity.validateListConfig()
    request.flash('searchString', searchString)

    return await this.env.render('changelist.njk', {
      request,
      section,
      entities,
      count,
      metadata,
      page,
      adminEntity,
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
    const { section, metadata } = await this.getAdminModels(params)

    // @debt architecture "This should be entirely moved to the adminSite, so that it can be overriden by the custom adminSite of a user"
    let entityToBePersisted = await this.adminSite.cleanValues(createEntityDto, metadata)

    // metadata.target is the entity class
    // entity class needs to be saved so that listeners and subscribers are triggered
    if (isClass(metadata.target)) {
      entityToBePersisted = Object.assign(new metadata.target(), entityToBePersisted)
    }

    const createdEntity = await this.entityManager.save(entityToBePersisted)

    request.flash(
      'messages',
      `Successfully created ${prettyPrint(metadata.name)}: ${displayName(createdEntity, metadata)}`,
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
    const { section, adminEntity, metadata, entity } = await this.getAdminModels(params)

    // @debt architecture "This should be entirely moved to the adminSite, so that it can be overriden by the custom adminSite of a user"
    const updatedValues = await this.adminSite.cleanValues(updateEntityDto, metadata)

    // entity class needs to be saved so that listeners and subscribers are triggered
    // @ts-ignore
    const entityToBePersisted = Object.assign(new metadata.target(), entity, updatedValues)

    // We first have to update the primary key, because `save()` would create a new entity.
    // We don't update all fields with `update()`, because it doesn't cascade or handle relations.
    await this.entityManager.update(
      adminEntity.entity,
      metadata.getEntityIdMap(entity),
      metadata.getEntityIdMap(entityToBePersisted),
    )
    // Primary key updated, we can safely update all the other fields
    await this.entityManager.save(entityToBePersisted)

    const updatedEntity = await this.getEntityWithRelations(
      adminEntity,
      getPrimaryKeyValue(metadata, entityToBePersisted),
    )
    request.flash(
      'messages',
      `Successfully updated ${prettyPrint(metadata.name)}: ${displayName(entity, metadata)}`,
    )
    return response.redirect(urls.changeUrl(section, metadata, updatedEntity))
  }

  @Post(':sectionName/:entityName/:primaryKey/delete')
  async delete(
    @Req() request: Request,
    @Param() params: AdminModelsQuery,
    @Response() response: express.Response,
  ) {
    const { section, metadata, entity } = await this.getAdminModels(params)
    const entityDisplayName = displayName(entity, metadata)
    // @debt architecture "This should be entirely moved to the adminSite, so that it can be overriden by the custom adminSite of a user"
    await this.entityManager.remove(entity)
    request.flash(
      'messages',
      `Successfully deleted ${prettyPrint(metadata.name)}: ${entityDisplayName}`,
    )
    return response.redirect(urls.changeListUrl(section, metadata))
  }

  @Post(':sectionName/:entityName/action')
  async executeListAction(
    @Req() request: Request,
    @Body('listActionIndex') listActionIndex: number,
    @Param() params: AdminModelsQuery,
    @Response() response: express.Response,
  ) {
    const { adminEntity, section, metadata } = await this.getAdminModels(params)

    const listAction = adminEntity.listActions[listActionIndex].action
    const boundedListAction = listAction.bind(adminEntity)
    await boundedListAction(request, response)

    return response.redirect(urls.changeListUrl(section, metadata))
  }

  @Post(':sectionName/:entityName/:primaryKey/action')
  async executeChangeAction(
    @Req() request: Request,
    @Body('changeActionIndex') changeActionIndex: number,
    @Param() params: AdminModelsQuery,
    @Response() response: express.Response,
  ) {
    const { adminEntity, section, metadata, entity } = await this.getAdminModels(params)

    const changeAction = adminEntity.changeActions[changeActionIndex].action
    const boundedChangeAction = changeAction.bind(adminEntity)
    await boundedChangeAction(entity, request, response)

    return response.redirect(urls.changeActionUrl(section, metadata, entity))
  }
}
