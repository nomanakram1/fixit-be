import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserDetailsEntity } from 'src/userDetails/entity/userDetails.entity';
import { UserToRoleEntity } from 'src/userToRoles/entity/userToRoles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity,UserDetailsEntity,UserToRoleEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
