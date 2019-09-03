import * as nunjucks from 'nunjucks'
import * as dateFilter from 'nunjucks-date-filter'
import { join } from 'path'
import { Injectable, Inject, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import * as filters from './admin.filters'
import DefaultAdminSite from './adminSite'
import { getWidgetTemplate, getRelationOptions } from './utils/widget'
import { isEntityInList } from './utils/entity'
import { getPaginationRanges, generatePaginatedUrl } from './utils/pagination'
import { SetAsyncExtension } from './extensions/setAsync'
import { injectionTokens } from './tokens'

@Injectable({
  scope: Scope.REQUEST,
})
class DefaultAdminNunjucksEnvironment {
  env: nunjucks.Environment

  constructor(
    @Inject(injectionTokens.ADMIN_SITE)
    private adminSite: DefaultAdminSite,
    @Inject(REQUEST) public request: any,
  ) {
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
    this.env.addGlobal('generatePaginatedUrl', generatePaginatedUrl)
  }

  async render(name: string, context?: object) {
    const prom = new Promise((resolve, reject) => {
      this.env.render(name, context, function(err, res) {
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
}

export default DefaultAdminNunjucksEnvironment
