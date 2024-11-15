import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToRoleEntity } from './entity/userToRoles.entity';
import { UserToRolesService } from './userToRoles.service';
import { UserToRolesController } from './userToRoles.controller';
import { RoleEntity } from '../roles/entity/roles.entity';
import { UsersEntity } from 'src/user/entity/user.entity';
import { UsersModule } from 'src/user/user.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, UserToRoleEntity, UsersEntity]),UsersModule,RolesModule],
  providers: [UserToRolesService],
  controllers: [UserToRolesController],
  exports: [UserToRolesService],
})
export class UserToRolesModule {}
