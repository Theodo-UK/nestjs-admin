// This config is only used for testing

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: 'seed',
  password: 'Ge0rgesMoustaki',
  database: 'seed',
  entities: [__dirname + '/src/**/*.entity.{js,ts}'],
  synchronize: false,
}
