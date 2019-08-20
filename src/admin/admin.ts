import { Injectable } from '@nestjs/common'
import { DefaultAdminSite } from '@app/nestjs-admin'

@Injectable()
export class AdminSite extends DefaultAdminSite {}
