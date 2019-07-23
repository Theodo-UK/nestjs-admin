import { Get, Controller, Render, Param, Query } from '@nestjs/common'
import { AdminSite } from './admin.service'

function getPaginationOptions(page?: number) {
  page = page || 0
  // @architecture configuration "williamd: this could be made configurable on a per-section basis"
  const perPage = 25

  return {
    skip: perPage * page,
    take: perPage,
  }
}

@Controller('admin')
export class AdminController {
  constructor(private adminSite: AdminSite) { }

  @Get()
  @Render('index.njk')
  root() {
    const sections = this.adminSite.getSectionList()
    return { sections }
  }

  @Get(':section/:entity')
  @Render('changelist.njk')
  async changeList(
    @Param('section') sectionName: string,
    @Param('entity') entityName: string,
    @Query('page') page?: number,
  ) {
    const section = this.adminSite.getSection(sectionName)
    const repository = section.getRepository(entityName)
    const [entities, count] = await repository.findAndCount(getPaginationOptions(page))
    return { section, entities, count, metadata: repository.metadata }
  }
}
