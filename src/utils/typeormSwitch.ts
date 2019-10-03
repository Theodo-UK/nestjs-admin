import * as ProdTORM from 'typeorm' // for prod

let TORM = ProdTORM

if (process.env.NESTJS_ADMIN_TYPEORM_PATH) {
  TORM = require(process.env.NESTJS_ADMIN_TYPEORM_PATH)
}

export = TORM
