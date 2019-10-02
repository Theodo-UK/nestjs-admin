const AdminUser = require('nestjs-admin').AdminUserEntity

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/dist/**/*.entity.js', AdminUser],
  migrations: ['dist/migration/*.js'],
  synchronize: false,
}
