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
} from '@nestjs/common'
import { Repository, EntityMetadata } from 'typeorm'
import * as express from 'express'
import DefaultAdminSite from './adminSite'
import DefaultAdminSection from './adminSection'
import DefaultAdminNunjucksEnvironment from './admin.environment'
import * as urls from './utils/urls'
import { isClass } from './utils/typechecks'
import { AdminGuard } from './admin.guard'
import { AdminFilter } from './admin.filter'
import { injectionTokens } from './tokens'

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
    const result: AdminModelsResult = {}
    if (query.sectionName) {
      result.section = this.adminSite.getSection(query.sectionName)
      if (query.entityName) {
        result.repository = result.section.getRepository(query.entityName)
        result.metadata = result.repository.metadata
        if (query.primaryKey) {
          result.entity = await this.getEntityWithRelations(result.repository, query.primaryKey)
        }
      }
    }
    return result
  }

  @Get()
  async index() {
    const sections = this.adminSite.getSectionList()
    return await this.env.render('index.njk', { sections })
  }

  @Get(':sectionName/:entityName')
  async changeList(@Param() params: AdminModelsQuery, @Query('page') pageParam: string = '1') {
    const { section, repository, metadata } = await this.getAdminModels(params)
    const page = parseInt(pageParam, 10)
    const [entities, count] = await repository.findAndCount(getPaginationQueryOptions(page))

    return await this.env.render('changelist.njk', {
      section,
      entities,
      count,
      metadata,
      page,
      resultsPerPage,
    })
  }

  @Get(':sectionName/:entityName/add')
  async add(@Param() params: AdminModelsQuery) {
    const { section, metadata } = await this.getAdminModels(params)
    return await this.env.render('add.njk', { section, metadata })
  }

  @Post(':sectionName/:entityName/add')
  async create(
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

    return response.redirect(urls.changeUrl(section, metadata, createdEntity))
  }

  @Get(':sectionName/:entityName/:primaryKey/change')
  async change(@Param() params: AdminModelsQuery) {
    const { section, metadata, entity } = await this.getAdminModels(params)
    return await this.env.render('change.njk', { section, metadata, entity })
  }

  @Post(':sectionName/:entityName/:primaryKey/delete')
  async delete(@Param() params: AdminModelsQuery, @Response() response: express.Response) {
    const { section, repository, metadata, entity } = await this.getAdminModels(params)
    // @debt architecture "This should be entirely moved to the adminSite, so that it can be overriden by the custom adminSite of a user"
    await repository.remove(entity)
    return response.redirect(urls.changeListUrl(section, metadata))
  }

  @Post(':sectionName/:entityName/:primaryKey/change')
  async update(@Body() updateEntityDto: object, @Param() params: AdminModelsQuery) {
    const { section, repository, metadata, entity } = await this.getAdminModels(params)

    // @debt architecture "This should be entirely moved to the adminSite, so that it can be overriden by the custom adminSite of a user"
    const updatedValues = await this.adminSite.cleanValues(updateEntityDto, metadata)

    // entity class needs to be saved so that listeners and subscribers are triggered
    const entityToBePersisted = Object.assign(entity, updatedValues)
    await repository.save(entityToBePersisted)

    const updatedEntity = await this.getEntityWithRelations(repository, params.primaryKey)
    return await this.env.render('change.njk', { section, metadata, entity: updatedEntity })
  }
}
