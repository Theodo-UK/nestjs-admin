import * as NestJSTypeORM from 'typeorm'

let TORM = NestJSTypeORM

// tslint:disable:no-var-requires
if (process.env.NESTJS_ADMIN_TYPEORM_PATH) {
  TORM = require(process.env.NESTJS_ADMIN_TYPEORM_PATH)
}

// WHY? To improve development environment:
//
// In our dev env there are two typeorm libraries:
// The first is in the library itself in /node_modules
// The second is in exampleApp/node_modules
//
// This was causing issues with conditions within 'typeorm' e.g. "instanceof {Class}" comparisons
// This broke some features of 'typeorm' when we were developing using exampleApp
// So we have added the NESTJS_ADMIN_TYPEORM_PATH env variable to set which 'typeorm' library to use in 'start:debug' command

export = TORM
