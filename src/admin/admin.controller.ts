import { Controller, Inject } from '@nestjs/common'
import { DefaultAdminController } from '@app/nestjs-admin'
import { AdminSite } from './admin'

export class AdminController extends DefaultAdminController {
  @Inject(AdminSite)
  // tslint:disable-next-line
  private _adminSite: AdminSite

  get adminSite() {
    return this._adminSite
  }
}
