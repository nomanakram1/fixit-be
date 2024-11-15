import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
dotenv.config({ path: `.env` });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Always set to false when using migrations
  logging: ["query", "error", "schema", "warn"],
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  // entities: [UsersEntity, UserDetailsEntity, RoleEntity, UserToRoleEntity],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
});
