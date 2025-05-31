import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'gym_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // Solo en desarrollo
  logging: process.env.NODE_ENV === 'development',
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
  } : undefined,
};
