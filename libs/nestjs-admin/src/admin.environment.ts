import * as nunjucks from 'nunjucks'
import * as dateFilter from 'nunjucks-date-filter'
import { join } from 'path'
import { Injectable, Inject, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import * as filters from './admin.filters'
import AdminSite from './adminSite'
import { getWidgetTemplate, getRelationOptions } from './utils/widget'
import { isEntityInList } from './utils/entity'
import { getPaginationRanges, generatePaginationUrl } from './utils/pagination'
import { SetAsyncExtension } from './extensions/setAsync'

@Injectable({
  scope: Scope.REQUEST,
})
class DefaultAdminNunjucksEnvironment {
  env: nunjucks.Environment

  constructor(adminSite: AdminSite, @Inject(REQUEST) public request: any) {
    // Configure nunjucks for the admin
    this.env = nunjucks.configure(join(__dirname, 'views'), {
      noCache: true,
    })

    this.env.addExtension('SetAsyncExtension', new SetAsyncExtension())

    dateFilter.setDefaultFormat('YYYY-MM-DD')
    this.env.addFilter('date', dateFilter)
    this.env.addFilter('adminUrl', filters.adminUrl)
    this.env.addFilter('displayName', filters.displayName)

    this.env.addGlobal('request', request)
    this.env.addGlobal('adminSite', adminSite)
    this.env.addGlobal('getWidgetTemplate', getWidgetTemplate)
    this.env.addGlobal('getRelationOptions', getRelationOptions) // Meh name
    this.env.addGlobal('isEntityInList', isEntityInList)
    this.env.addGlobal('getPaginationRanges', getPaginationRanges)
    this.env.addGlobal('generatePaginationUrl', generatePaginationUrl)
  }
}

export default DefaultAdminNunjucksEnvironment
