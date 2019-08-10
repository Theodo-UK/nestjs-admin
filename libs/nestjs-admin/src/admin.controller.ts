import { Get, Post, Controller, Param, Query, Body, Response } from '@nestjs/common'
import { Repository, EntityMetadata } from 'typeorm'
import * as express from 'express'
import AdminSite from './adminSite'
import AdminSection from './adminSection'
import { AdminNunjucksEnvironment } from './admin.environment'
import * as urls from './utils/urls'

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
  constructor(private adminSite: AdminSite, private env: AdminNunjucksEnvironment) {}

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

  async render(name: string, context?: object) {
    const prom = new Promise((resolve, reject) => {
      this.env.env.render(name, context, function(err, res) {
        if (err) {
          reject(err)
          return err
        }
        resolve(res)
        return res
      })
    })
    const rendered = await prom
    return rendered
  }

  @Get()
  async index() {
    const sections = this.adminSite.getSectionList()
    return await this.render('index.njk', { sections })
  }

  @Get(':sectionName/:entityName')
  async changeList(@Param() params: AdminModelsQuery, @Query('page') page?: number) {
    const { section, repository, metadata } = await this.getAdminModels(params)
    const [entities, count] = await repository.findAndCount(getPaginationOptions(page))
    return await this.render('changelist.njk', { section, entities, count, metadata })
  }

  @Get(':sectionName/:entityName/add')
  async add(@Param() params: AdminModelsQuery) {
    const { section, metadata } = await this.getAdminModels(params)
    return await this.render('add.njk', { section, metadata })
  }

  @Post(':sectionName/:entityName/add')
  async create(
    @Body() createEntityDto: object,
    @Param() params: AdminModelsQuery,
    @Response() response: express.Response,
  ) {
    const { section, repository, metadata } = await this.getAdminModels(params)

    const cleanedValues = this.adminSite.cleanValues(createEntityDto, metadata)
    const createdEntity = await repository.save(cleanedValues)

    return response.redirect(urls.changeUrl(section, metadata, createdEntity))
  }

  @Get(':sectionName/:entityName/:primaryKey/change')
  async change(@Param() params: AdminModelsQuery) {
    const { section, metadata, entity } = await this.getAdminModels(params)
    return await this.render('change.njk', { section, metadata, entity })
  }

  @Post(':sectionName/:entityName/:primaryKey/change')
  async update(@Body() updateEntityDto: object, @Param() params: AdminModelsQuery) {
    const { section, repository, metadata, entity } = await this.getAdminModels(params)

    const updateCriteria = metadata.getEntityIdMap(entity)
    const updatedValues = this.adminSite.cleanValues(updateEntityDto, metadata)
    await repository.update(updateCriteria, updatedValues)

    const updatedEntity = await repository.findOneOrFail(params.primaryKey)
    return await this.render('change.njk', { section, metadata, entity: updatedEntity })
  }
}
