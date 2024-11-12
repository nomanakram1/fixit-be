import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserDetailsEntity } from 'src/userDetails/entity/userDetails.entity';
import { UserToRoleEntity } from 'src/userToRoles/entity/userToRoles.entity';
import { JwtModule } from '@nestjs/jwt';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity,UserDetailsEntity,UserToRoleEntity]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s` },
    }),
  }),],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
