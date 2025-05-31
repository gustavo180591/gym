import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseConfig } from './database.config';

export const typeormConfig: TypeOrmModuleOptions = {
  ...databaseConfig,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
}
