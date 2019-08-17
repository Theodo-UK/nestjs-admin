import * as nunjucks from 'nunjucks'
import * as dateFilter from 'nunjucks-date-filter'
import { join } from 'path'
import { Injectable } from '@nestjs/common'
import * as filters from './admin.filters'
import AdminSite from './adminSite'
import { getWidgetTemplate, getRelationOptions } from './utils/widget'
import { isEntityInList } from './utils/entity'
import { SetAsyncExtension } from './extensions/setAsync'

@Injectable()
class DefaultAdminNunjucksEnvironment {
  env: nunjucks.Environment

  constructor(adminSite: AdminSite) {
    // Configure nunjucks for the admin
    this.env = nunjucks.configure(join(__dirname, 'views'), {
      noCache: true,
    })

    this.env.addExtension('SetAsyncExtension', new SetAsyncExtension())

    dateFilter.setDefaultFormat('YYYY-MM-DD')
    this.env.addFilter('date', dateFilter)
    this.env.addFilter('adminUrl', filters.adminUrl)
    this.env.addFilter('displayName', filters.displayName)

    this.env.addGlobal('adminSite', adminSite)
    this.env.addGlobal('getWidgetTemplate', getWidgetTemplate)
    this.env.addGlobal('getRelationOptions', getRelationOptions) // Meh name
    this.env.addGlobal('isEntityInList', isEntityInList)
  }
}

export default DefaultAdminNunjucksEnvironment
