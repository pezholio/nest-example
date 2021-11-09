import {registerAs} from "@nestjs/config";
import { config as setConfig } from 'dotenv';

setConfig({ path: `.env.${process.env.NODE_ENV}` });

export default registerAs('database', () => {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: ['./dist/**/*.entity{.ts,.js}'],
      migrations: ['./dist/db/migrate/*{.ts,.js}'],
      migrationsRun: true,
      cli: {
        migrationsDir: 'src/db/migrate'
      }
    }
})
