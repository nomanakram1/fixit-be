import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserDetailsModule } from './userDetails/userDetails.module';
import { RolesModule } from './roles/roles.module';
import { UserToRolesModule } from './userToRoles/userToRoles.module';
import { SubscriptionPlanModule } from './subscriptionPlan/subscriptionplan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule accessible throughout the app
      // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Automatically loads the .env file based on NODE_ENV
      envFilePath: `.env`, // Automatically loads the .env file based on NODE_ENV
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, // Avoid this in production, use migrations instead
        ssl: {
          rejectUnauthorized: false, // Set this to false if you encounter SSL certificate issues
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    UserDetailsModule,
    RolesModule,
    UserToRolesModule,
    SubscriptionPlanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
