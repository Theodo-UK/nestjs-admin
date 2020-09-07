"use strict";
const NestJSTypeORM = require("typeorm");
let TORM = NestJSTypeORM;
if (process.env.NESTJS_ADMIN_TYPEORM_PATH) {
    TORM = require(process.env.NESTJS_ADMIN_TYPEORM_PATH);
}
module.exports = TORM;
//# sourceMappingURL=typeormProxy.js.map