import * as session from 'express-session'
import { join } from 'path'
import { DeepPartial } from 'typeorm'
import { merge as _merge } from 'lodash'

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

export function createAppConfiguration(
  userConfig: DeepPartial<AdminAppConfigurationOptions>,
): AdminAppConfigurationOptions {
  const config: AdminAppConfigurationOptions = _merge(
    {},
    defaultAdminConfigurationOptions,
    userConfig,
  )
  return config
}
