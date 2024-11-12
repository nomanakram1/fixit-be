import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { RoleEntity } from './entity/roles.entity';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  // Create a new role
  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ description: 'Role name and description', schema: { example: { name: 'customer', description: 'Customer role' } } })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 409, description: 'Role with the given name already exists' })
  async createRole(@Body() body: { name: string; description?: string }): Promise<RoleEntity> {
    const { name, description } = body;
    return this.rolesService.createRole(name, description);
  }

  // Retrieve all roles
  @Get()
  @ApiOperation({ summary: 'Retrieve all roles' })
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully' })
  async getAllRoles(): Promise<RoleEntity[]> {
    return this.rolesService.getAllRoles();
  }

  // Retrieve a single role by ID
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a role by ID' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async getRoleById(@Param('id') id: string): Promise<RoleEntity> {
    return this.rolesService.getRoleById(id);
  }

  // Update an existing role by ID
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing role by ID' })
  @ApiBody({ description: 'Updated role name and description', schema: { example: { name: 'manager', description: 'Updated role description' } } })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async updateRole(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
  ): Promise<RoleEntity> {
    const { name, description } = body;
    return this.rolesService.updateRole(id, name, description);
  }

  // Delete a role by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async deleteRole(@Param('id') id: string): Promise<void> {
    return this.rolesService.deleteRole(id);
  }
}
