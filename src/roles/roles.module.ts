import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleEntity } from './entity/roles.entity';
import { UserToRoleEntity } from '../userToRoles/entity/userToRoles.entity';
import { UsersEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity,UserToRoleEntity, UsersEntity])],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
