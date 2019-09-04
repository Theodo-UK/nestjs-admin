import { Injectable } from '@nestjs/common'
import { DefaultAdminSite } from 'nestjs-admin'

@Injectable()
export class AdminSite extends DefaultAdminSite {}
