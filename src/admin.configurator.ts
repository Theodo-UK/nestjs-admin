import * as session from 'express-session'
import * as passport from 'passport'
import { join } from 'path'
import { DeepPartial } from 'typeorm'
import { merge as _merge } from 'lodash'
import flash = require('connect-flash')
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core'
import { Injectable, Inject, OnModuleInit } from '@nestjs/common'
import { injectionTokens } from './tokens'

export const publicFolder = join(__dirname, 'public')

export interface AdminAppConfigurationOptions {
  session: session.SessionOptions
  assetPrefix: string
  serializeUser: (user: any, done: (err: any, id?: any) => void) => void
  deserializeUser: (payload: any, done: (err: Error, payload: string) => void) => void
}

function serializeAdminUser(user: any, done: (err: Error, user: any) => void): any {
  done(null, user)
}

function deserializeAdminUser(payload: any, done: (err: Error, payload: string) => void): any {
  done(null, payload)
}

export const defaultAdminConfigurationOptions: AdminAppConfigurationOptions = {
  session: {
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  },
  assetPrefix: '/admin-static',
  serializeUser: serializeAdminUser,
  deserializeUser: deserializeAdminUser,
}

@Injectable()
class AdminAppConfigurator implements OnModuleInit {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    @Inject(injectionTokens.APP_CONFIG)
    private readonly appConfig: DeepPartial<AdminAppConfigurationOptions>,
  ) {}

  onModuleInit() {
    const config: AdminAppConfigurationOptions = _merge(
      {},
      defaultAdminConfigurationOptions,
      this.appConfig,
    )
    const httpAdapter = this.adapterHost.httpAdapter

    httpAdapter.use('/admin', session(config.session))

    httpAdapter.use('/admin', passport.initialize())
    httpAdapter.use('/admin', passport.session())
    httpAdapter.use('/admin', flash())

    passport.serializeUser(config.serializeUser)
    passport.deserializeUser(config.deserializeUser)

    // needs to be after the sassMiddleware
    httpAdapter.useStaticAssets(publicFolder, { prefix: config.assetPrefix })
  }
}

export default AdminAppConfigurator
