module.exports = {
  type: 'postgres',
  url: 'postgres://postgres@localhost:5432/nest-test',
  entities: [(process.env.NODE_ENV === 'test') ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js'],
  migrations: [(process.env.NODE_ENV === 'test') ? 'src/db/migrate/*.ts' : 'dist/db/migrate/*.js'],
  cli: {
    migrationsDir: "src/db/migrate"
  }
}
