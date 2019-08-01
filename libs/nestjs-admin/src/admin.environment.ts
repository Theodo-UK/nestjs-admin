import * as nunjucks from 'nunjucks'
import { join } from 'path'
import { Injectable } from '@nestjs/common'
import * as filters from './admin.filters'
import { AdminSite } from './admin.service'
import { getWidgetTemplate, getRelationOptions } from './utils/widget'
import { SetAsyncExtension } from './extensions/setAsync'

@Injectable()
export class AdminNunjucksEnvironment {
  env: nunjucks.Environment

  constructor(adminSite: AdminSite) {
    // Configure nunjucks for the admin
    this.env = nunjucks.configure(join(__dirname, 'views'), {
      noCache: true,
    })

    this.env.addExtension('SetAsyncExtension', new SetAsyncExtension())

    this.env.addFilter('adminUrl', filters.adminUrl)
    this.env.addFilter('displayName', filters.displayName)

    this.env.addGlobal('adminSite', adminSite)
    this.env.addGlobal('getWidgetTemplate', getWidgetTemplate)
    this.env.addGlobal('getRelationOptions', getRelationOptions)
  }
}
