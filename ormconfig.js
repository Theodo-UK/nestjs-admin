const AdminUser = require('./libs/nestjs-admin/src').AdminUser

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/**/*.entity.{js,ts}', AdminUser],
  migrations: ['migration/*.ts'],
  synchronize: false,
}
