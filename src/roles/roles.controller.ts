import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleEntity } from './entity/roles.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Create a new role
  @Post()
  async createRole(@Body() body: { name: string; description?: string }): Promise<RoleEntity> {
    const { name, description } = body;
    return this.rolesService.createRole(name, description);
  }

  // Retrieve all roles
  @Get()
  async getAllRoles(): Promise<RoleEntity[]> {
    return this.rolesService.getAllRoles();
  }

  // Retrieve a single role by ID
  @Get(':id')
  async getRoleById(@Param('id') id: string): Promise<RoleEntity> {
    return this.rolesService.getRoleById(id);
  }

  // Update an existing role by ID
  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
  ): Promise<RoleEntity> {
    const { name, description } = body;
    return this.rolesService.updateRole(id, name, description);
  }

  // Delete a role by ID
  @Delete(':id')
  async deleteRole(@Param('id') id: string): Promise<void> {
    return this.rolesService.deleteRole(id);
  }
}
