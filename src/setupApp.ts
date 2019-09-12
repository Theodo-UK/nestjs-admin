import * as session from 'express-session'
import * as passport from 'passport'
import { join } from 'path'
import { DeepPartial } from 'typeorm'
import { merge as _merge } from 'lodash'
import flash = require('connect-flash')
import { AbstractHttpAdapter } from '@nestjs/core'

export const publicFolder = join(__dirname, 'public')

export interface AdminAppConfigurationOptions {
  session: session.SessionOptions
  assetPrefix: string
  serializeUser: (user: any, done: (err: any, id?: any) => void) => void
  deserializeUser: (payload: any, done: (err: Error, payload: string) => void) => void
}

const defaultAdminConfigurationOptions: AdminAppConfigurationOptions = {
  session: {
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  },
  assetPrefix: '/admin-static',
  serializeUser: serializeAdminUser,
  deserializeUser: deserializeAdminUser,
}

function serializeAdminUser(user: any, done: (err: Error, user: any) => void): any {
  done(null, user)
}

function deserializeAdminUser(payload: any, done: (err: Error, payload: string) => void): any {
  done(null, payload)
}

export function configureAdminApp(
  app: AbstractHttpAdapter,
  options?: DeepPartial<AdminAppConfigurationOptions>,
): void

export function configureAdminApp(
  app: AbstractHttpAdapter,
  // tslint:disable-next-line:variable-name
  _options: DeepPartial<AdminAppConfigurationOptions> = {},
) {
  const options: AdminAppConfigurationOptions = _merge(
    {},
    defaultAdminConfigurationOptions,
    _options,
  )

  app.use('/admin', session(options.session))

  app.use('/admin', passport.initialize())
  app.use('/admin', passport.session())
  app.use('/admin', flash())

  passport.serializeUser(options.serializeUser)
  passport.deserializeUser(options.deserializeUser)

  // needs to be after the sassMiddleware
  app.useStaticAssets(publicFolder, { prefix: options.assetPrefix })
}
