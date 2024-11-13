import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserToRolesService } from './userToRoles.service';
import { UserToRoleEntity } from './entity/userToRoles.entity';
import { CreateUserToRoleDto, UpdateUserToRoleDto } from './dto/userToRoles.dto';

@Controller('user-to-roles')
export class UserToRolesController {
  constructor(private readonly userToRolesService: UserToRolesService) {}

  // Create a new user-to-role entry
  @Post()
  async createUserToRole(@Body() createUserToRoleDto: CreateUserToRoleDto): Promise<UserToRoleEntity> {
    return this.userToRolesService.createUserToRole(createUserToRoleDto);
  }

  // Retrieve all user-to-role entries
  @Get()
  async getAllUserToRoles(): Promise<UserToRoleEntity[]> {
    return this.userToRolesService.getAllUserToRoles();
  }

  // Retrieve a single user-to-role entry by ID
  @Get(':id')
  async getUserToRoleById(@Param('id') id: string): Promise<UserToRoleEntity> {
    return this.userToRolesService.getUserToRoleById(id);
  }

  // Update an existing user-to-role entry by ID
  @Put(':id')
  async updateUserToRole(
    @Param('id') id: string,
    @Body() updateUserToRoleDto: UpdateUserToRoleDto,
  ): Promise<UserToRoleEntity> {
    return this.userToRolesService.updateUserToRole(id, updateUserToRoleDto);
  }

  // Delete a user-to-role entry by ID
  @Delete(':id')
  async deleteUserToRole(@Param('id') id: string): Promise<void> {
    return this.userToRolesService.deleteUserToRole(id);
  }
}
